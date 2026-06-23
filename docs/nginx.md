# Nginx & Infrastructure Configuration
## GoldenMovies — Debian VPS

> **Scope**: server-level configuration for a single Debian VPS hosting the public case study.
> The application-layer rate limiter (`middleware.ts`) and security headers (`next.config.ts`)
> complement these settings but are not a substitute for them.

---

## Table of Contents

- [I-01 — Nginx: SSE connection limit](#i-01--nginx-sse-connection-limit)
- [I-02 — Nginx: API rate limiting](#i-02--nginx-api-rate-limiting)
- [I-03 — Nginx: SSL/TLS and HSTS](#i-03--nginx-ssltls-and-hsts)
- [I-04 — Nginx: security headers at server level](#i-04--nginx-security-headers-at-server-level)
- [I-05 — Nginx: server_tokens off](#i-05--nginx-server_tokens-off)
- [I-06 — Systemd: Node.js process limits](#i-06--systemd-nodejs-process-limits)
- [I-07 — Certbot: automatic certificate renewal](#i-07--certbot-automatic-certificate-renewal)
- [Post-deploy verification checklist](#post-deploy-verification-checklist)

---

## I-01 — Nginx: SSE connection limit

**Why this matters**: `GET /api/showtimes/[id]/seats/stream` keeps a persistent HTTP connection open
(Server-Sent Events) for each connected client. Without a concurrent connection limit, a single IP
can exhaust the Node.js process's file descriptors (Debian default: 1,024) and bring the server down.

The application-layer middleware (`middleware.ts`) validates the showtime ID and enforces a
request-rate limit, but it cannot cap the number of simultaneously open long-lived connections —
that must be done at the network level by Nginx.

### Nginx zone definitions

Create a shared zone file so limits are reusable across vhosts:

```nginx
# /etc/nginx/conf.d/zones.conf

# Zone for SSE concurrent-connection cap, keyed by client IP
limit_conn_zone $binary_remote_addr zone=sse_conn:10m;

# Zone for general API request rate, keyed by client IP
limit_req_zone $binary_remote_addr zone=api_req:10m rate=60r/m;

# Zone for write endpoints (lock, release, profile), keyed by client IP
limit_req_zone $binary_remote_addr zone=api_write:10m rate=20r/m;
```

### Vhost configuration

```nginx
# /etc/nginx/sites-available/golden-movies

upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # ── SSE: persistent seat-map stream connections ───────────────────────
    location ~ ^/api/showtimes/.+/seats/stream$ {
        limit_conn sse_conn 5;        # max 5 simultaneous SSE connections per IP
        limit_req  zone=api_req burst=10 nodelay;

        proxy_pass              http://nextjs;
        proxy_http_version      1.1;
        proxy_set_header        Connection "";
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_buffering         off;    # required for SSE — disables response buffering
        proxy_cache             off;
        proxy_read_timeout      120s;   # clean close if the client disappears silently
        chunked_transfer_encoding on;
    }

    # ── Write endpoints: seat lock, release, user profile ────────────────
    location ~ ^/api/(showtimes/.+/seats/(lock|release)|profile)$ {
        limit_req zone=api_write burst=5 nodelay;

        proxy_pass          http://nextjs;
        proxy_http_version  1.1;
        proxy_set_header    Connection "";
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # ── All other API routes (movies, venues, search, etc.) ──────────────
    location /api/ {
        limit_req zone=api_req burst=30 nodelay;

        proxy_pass          http://nextjs;
        proxy_http_version  1.1;
        proxy_set_header    Connection "";
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # ── Pages and static assets ───────────────────────────────────────────
    location / {
        proxy_pass          http://nextjs;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection "upgrade";
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout  60s;
    }
}
```

Enable the vhost:

```bash
sudo ln -s /etc/nginx/sites-available/golden-movies /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## I-02 — Nginx: API rate limiting

Nginx is the **primary** rate-limiting layer because it acts before the request reaches the Node.js
process. The in-process middleware (`middleware.ts`) is a secondary layer that provides defense in
depth for cases where Nginx is not in front (e.g., direct access during development).

Summary of limits applied by the configuration in I-01:

| Zone | Target | Rate | Burst |
|---|---|---|---|
| `api_req` | `GET /api/*` | 60 req/min | 30 |
| `api_write` | `POST` lock / release / profile | 20 req/min | 5 |
| `sse_conn` | SSE stream | max 5 concurrent connections per IP | — |

---

## I-03 — Nginx: SSL/TLS and HSTS

The application sends `Strict-Transport-Security` via `next.config.ts`. Nginx must also send it so
the header is present even when the upstream returns an error and Nginx serves its own error page.

Add inside the `server { listen 443 ... }` block:

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
```

Recommended minimum TLS configuration:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

---

## I-04 — Nginx: security headers at server level

Next.js already sends `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, and `Permissions-Policy`. Do **not** duplicate these in Nginx — duplicate headers
cause both values to be sent to the browser, which can break CSP enforcement.

Add only these two at the Nginx level so they are present on Nginx's own error pages:

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## I-05 — Nginx: server_tokens off

By default, Nginx includes its version number in response headers and error pages
(`Server: nginx/1.25.3`), making version-specific CVE lookups trivial for an attacker.

```nginx
# /etc/nginx/nginx.conf — inside the http { } block
server_tokens off;
```

Verify:

```bash
curl -sI https://your-domain.com | grep -i server
# Expected output: Server: nginx  (no version number)
```

---

## I-06 — Systemd: Node.js process limits

The Debian default file descriptor limit is 1,024 per process. With Nginx capping SSE connections at
5 per IP (I-01), the maximum number of simultaneous SSE streams scales with the number of unique IPs,
not per-IP. The service file below raises the limit and sets a memory ceiling to prevent an OOM from
taking down the entire server.

```ini
# /etc/systemd/system/golden-movies.service

[Unit]
Description=GoldenMovies Next.js
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/golden-movies
ExecStart=/usr/bin/node node_modules/.bin/next start -p 3000
Restart=on-failure
RestartSec=5

# Raise the file descriptor limit for SSE connections + Nginx sockets
LimitNOFILE=65536

# Kill the process if it exceeds 512 MB — prevents a runaway leak from
# taking down the whole server
MemoryMax=512M
MemorySwapMax=0

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable golden-movies
sudo systemctl start golden-movies
sudo systemctl status golden-movies
```

---

## I-07 — Certbot: automatic certificate renewal

```bash
# Install Certbot with the Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Obtain a certificate (Nginx must be running with the vhost already configured)
sudo certbot --nginx -d your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run

# The renewal cron/timer is installed automatically — verify with:
# sudo systemctl list-timers | grep certbot
```

---

## Post-deploy verification checklist

```bash
# 1. Security headers present
curl -sI https://your-domain.com | grep -iE \
  "strict-transport|x-frame|x-content|referrer|permissions|content-security"

# 2. Rate limiting fires after the burst is exhausted
for i in $(seq 1 70); do
  curl -s -o /dev/null -w "%{http_code}\n" https://your-domain.com/api/movies
done
# Requests beyond the burst should return 429

# 3. Server version is hidden
curl -sI https://your-domain.com | grep -i server
# Expected: Server: nginx  (no version)

# 4. TLS 1.0 is rejected
openssl s_client -connect your-domain.com:443 -tls1 2>&1 | grep -i "handshake failure"
# Expected: handshake failure (TLS 1.0 not supported)

# 5. Node.js service is running and memory limit is active
sudo systemctl status golden-movies
```
