import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { HomeRecommended } from "@/components/home/home-recommended";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <HomeRecommended />
    </>
  );
}
