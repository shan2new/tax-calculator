import { render, screen } from "@testing-library/react";
import { TaxModule } from "@/modules/tax/TaxModule";

vi.mock("@/components/SmoothNumber", () => ({
  SmoothNumber: ({ value }: { value: number }) => <span>{value}</span>,
}));

describe("TaxModule", () => {
  it("renders the FY badge and both scrub controls", () => {
    render(<TaxModule />);

    expect(screen.getByText("FY 2025–26")).toBeInTheDocument();
    expect(screen.getAllByText("Gross income").length).toBeGreaterThan(0);
    expect(screen.getByText("Deductions")).toBeInTheDocument();
  });

  it("always shows monthly take-home as the static headline", () => {
    render(<TaxModule />);

    expect(screen.getByText(/monthly take-home/i)).toBeInTheDocument();
  });
});
