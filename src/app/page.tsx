import { TaxCalculator } from "@/components/TaxCalculator";
import { DeveloperFooter } from "@/components/DeveloperFooter";
import { ClientThemeToggle } from "@/components/ClientThemeToggle";

export default function Home() {
  return (
    <main className="relative">
      <ClientThemeToggle />
      <TaxCalculator />
      <DeveloperFooter />
    </main>
  );
}
