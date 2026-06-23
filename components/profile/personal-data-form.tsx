"use client";

import { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { buildProfileSchema, type ProfileForm } from "@/lib/validation";
import {
  ID_PREFIXES,
  PHONE_PREFIXES,
  CURRENCIES,
  VE_GEO,
  PREF_GENRES,
  PROFILE_DEFAULTS,
} from "@/lib/profile-data";
import { CITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SAVED_NOTICE_MS = 2500;

export function PersonalDataForm() {
  const { t, lang } = useI18n();
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => buildProfileSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: PROFILE_DEFAULTS,
    mode: "onBlur",
  });

  const selectedState = useWatch({ control, name: "state" });
  const selectedCity = useWatch({ control, name: "city" });

  const cityOptions = VE_GEO.find((s) => s.state === selectedState)?.cities ?? [];
  const muniOptions =
    cityOptions.find((c) => c.city === selectedCity)?.municipalities ?? [];

  // Persists via API (PATCH /api/profile). Server validates with zod; no DB in the demo.
  const onSubmit = async (data: ProfileForm) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setSubmitError(t.profile.err.saveFailed);
        return;
      }
    } catch {
      setSubmitError(t.profile.err.saveFailed);
      return;
    }
    setSaved(true);
    reset(data);
    setTimeout(() => setSaved(false), SAVED_NOTICE_MS);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-gm-line bg-gm-bg-2/60">
      <div className="border-b border-gm-line/60 px-7 py-5">
        <h2 className="text-lg font-semibold">{t.profile.personalSection}</h2>
      </div>

      <div className="divide-y divide-gm-line/40">
        {/* First / Last name */}
        <Row label={t.profile.f.firstName} error={errors.firstName?.message}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              autoComplete="given-name"
              maxLength={60}
              {...register("firstName")}
              invalid={!!errors.firstName}
            />
            <div>
              <Input
                placeholder={t.profile.f.lastName}
                autoComplete="family-name"
                maxLength={60}
                {...register("lastName")}
                invalid={!!errors.lastName}
              />
              {errors.lastName && <Err>{errors.lastName.message}</Err>}
            </div>
          </div>
        </Row>

        <Row label={t.profile.f.email} error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            maxLength={254}
            spellCheck={false}
            {...register("email")}
            invalid={!!errors.email}
          />
        </Row>

        <Row label={t.profile.f.dob} error={errors.dob?.message}>
          <Input type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} {...register("dob")} invalid={!!errors.dob} />
        </Row>

        <Row label={t.profile.f.favoriteCity} error={errors.favoriteCity?.message}>
          <Select autoComplete="address-level2" {...register("favoriteCity")} invalid={!!errors.favoriteCity}>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Row>

        {/* National ID: prefix + number */}
        <Row label={t.profile.f.idDoc} error={errors.idNumber?.message}>
          <div className="flex gap-3">
            <Select autoComplete="off" {...register("idPrefix")} className="w-20 shrink-0">
              {ID_PREFIXES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Input
              className="flex-1"
              inputMode="numeric"
              autoComplete="off"
              maxLength={9}
              {...register("idNumber")}
              invalid={!!errors.idNumber}
            />
          </div>
        </Row>

        {/* Phone: area code prefix + local number */}
        <Row label={t.profile.f.phone} error={errors.phoneNumber?.message}>
          <div className="flex gap-3">
            <Select autoComplete="tel-area-code" {...register("phonePrefix")} className="w-28 shrink-0">
              {PHONE_PREFIXES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Input
              className="flex-1"
              inputMode="numeric"
              autoComplete="tel-local"
              maxLength={7}
              {...register("phoneNumber")}
              invalid={!!errors.phoneNumber}
            />
          </div>
        </Row>

        <Row label={t.profile.f.currency} error={errors.currency?.message}>
          <Select autoComplete="off" {...register("currency")} invalid={!!errors.currency}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </Select>
        </Row>

        {/* Cascading address selectors (state → city → municipality) */}
        <Row label={t.profile.f.address}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Select
                autoComplete="address-level1"
                {...register("state", {
                  onChange: () => {
                    setValue("city", "");
                    setValue("municipality", "");
                  },
                })}
              >
                <option value="">{t.profile.ph.selectState}</option>
                {VE_GEO.map((s) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </Select>

              <Select
                autoComplete="address-level2"
                {...register("city", { onChange: () => setValue("municipality", "") })}
                disabled={!selectedState}
              >
                <option value="">{t.profile.ph.selectCity}</option>
                {cityOptions.map((c) => (
                  <option key={c.city} value={c.city}>{c.city}</option>
                ))}
              </Select>

              <Select autoComplete="address-level3" {...register("municipality")} disabled={!selectedCity}>
                <option value="">{t.profile.ph.selectMunicipality}</option>
                {muniOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </div>
            <Input
              placeholder={t.profile.ph.street}
              autoComplete="address-line1"
              maxLength={120}
              {...register("street")}
            />
            <Input
              placeholder={t.profile.ph.apt}
              autoComplete="address-line2"
              maxLength={30}
              {...register("apt")}
            />
          </div>
        </Row>

        {/* Preferred genres (multi-select chip toggles) */}
        <Row label={t.profile.f.genres}>
          <Controller
            control={control}
            name="genres"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2.5">
                {PREF_GENRES.map((genre) => {
                  const isSelected = field.value.includes(genre.id);
                  return (
                    <button
                      type="button"
                      key={genre.id}
                      onClick={() =>
                        field.onChange(
                          isSelected
                            ? field.value.filter((id) => id !== genre.id)
                            : [...field.value, genre.id]
                        )
                      }
                      className={cn(
                        "h-9 rounded-full border px-4 text-[13px] font-medium transition-colors",
                        isSelected
                          ? "border-gm-gold/40 bg-gm-gold/10 text-gm-gold-1"
                          : "border-gm-line bg-gm-bg-3 text-gm-tx-2 hover:border-[#33333d] hover:text-gm-tx-1"
                      )}
                    >
                      {lang === "es" ? genre.es : genre.en}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Row>
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gm-line/60 px-7 py-5">
        {submitError && (
          <span className="mr-auto flex items-center gap-2 text-sm font-medium text-[#e0796b]">
            <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
            {submitError}
          </span>
        )}
        {saved && !submitError && (
          <span className="mr-auto flex items-center gap-2 text-sm font-medium text-gm-gold-1">
            <Check className="h-4 w-4 text-gm-gold" strokeWidth={2.5} />
            {t.profile.saved}
          </span>
        )}
        <button
          type="button"
          onClick={() => reset(PROFILE_DEFAULTS)}
          className="h-11 rounded-full border border-gm-line bg-gm-bg-3 px-6 text-sm font-semibold text-gm-tx-2 transition-colors hover:text-gm-tx-1"
        >
          {t.profile.reset}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full px-7 text-sm font-semibold transition-all",
            isSubmitting || !isDirty
              ? "cursor-not-allowed border border-gm-line bg-gm-bg-3 text-gm-tx-3"
              : "btn-gold"
          )}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? t.profile.saving : t.profile.save}
        </button>
      </div>
    </form>
  );
}

/* ── Form field sub-components ── */

function Row({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-8 px-7 py-5">
      <label className="pt-2.5 text-sm font-medium text-gm-tx-2">{label}</label>
      <div>
        {children}
        {error && <Err>{error}</Err>}
      </div>
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-[#e0796b]">{children}</p>;
}

const fieldBase =
  "h-11 w-full rounded-lg border bg-gm-bg-3 px-3.5 text-sm text-gm-tx-1 outline-hidden transition-colors placeholder:text-gm-tx-3 focus:border-gm-gold/40";

const Input = ({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => (
  <input
    {...props}
    className={cn(fieldBase, invalid ? "border-[#e0796b]/60" : "border-gm-line", className)}
  />
);

const Select = ({
  className,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) => (
  <select
    {...props}
    className={cn(
      fieldBase,
      "cursor-pointer appearance-none disabled:cursor-not-allowed disabled:opacity-40",
      invalid ? "border-[#e0796b]/60" : "border-gm-line",
      className
    )}
  >
    {children}
  </select>
);
