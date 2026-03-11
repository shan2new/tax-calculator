import { fireEvent, render, screen } from "@testing-library/react";
import { TaxModule } from "@/modules/tax/TaxModule";

vi.mock("@/components/SmoothNumber", () => ({
  SmoothNumber: ({ value }: { value: number }) => <span>{value}</span>,
}));

describe("TaxModule", () => {
  it("renders the core tax controls", () => {
    render(<TaxModule />);

    expect(screen.getByText("FY 2025–26")).toBeInTheDocument();
    expect(screen.getByText("Gross income")).toBeInTheDocument();
    expect(screen.getByText("Deductions (80C+D+HRA)")).toBeInTheDocument();
    expect(screen.getByText("Tax slabs (New)")).toBeInTheDocument();
  });

  it("cycles the hero without crashing", () => {
    render(<TaxModule />);

    const hero = screen.getByText("monthly take-home").closest('[role="button"]');
    expect(hero).not.toBeNull();
    fireEvent.click(hero as HTMLElement);

    expect(screen.getByText("FY 2025–26")).toBeInTheDocument();
  });
});
