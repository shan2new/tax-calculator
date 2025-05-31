import { TaxCalculator } from "@/components/TaxCalculator";
import { DeveloperFooter } from "@/components/DeveloperFooter";

export default function Home() {
  return (
    <main className="relative">
      <TaxCalculator />
      <DeveloperFooter />
    </main>
  );
}
