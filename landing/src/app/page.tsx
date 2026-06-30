import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { UseCases } from "@/components/use-cases";
import { PricingSection } from "@/components/pricing-section";
import { DemoOne } from "@/components/demo-one";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <DemoOne />
        <FeaturesSection />
        <UseCases />
        <PricingSection />
      </main>
      <SiteFooter />
    </>
  );
}
