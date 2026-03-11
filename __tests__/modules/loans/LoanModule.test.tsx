import { fireEvent, render, screen } from "@testing-library/react";
import { LoanModule } from "@/modules/loans/LoanModule";

vi.mock("@/providers/ThemeProvider", () => ({
  useTheme: () => ({ dark: true, toggle: vi.fn() }),
}));

vi.mock("@/components/Ring", () => ({
  Ring: () => <div data-testid="ring" />,
}));

vi.mock("@/components/SmoothNumber", () => ({
  SmoothNumber: ({ value }: { value: number }) => <span>{value}</span>,
}));

describe("LoanModule", () => {
  it("renders the loan controls and compare actions", () => {
    render(<LoanModule />);

    expect(screen.getByText("Loan amount")).toBeInTheDocument();
    expect(screen.getByText("Interest rate")).toBeInTheDocument();
    expect(screen.getByText("Tenure")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Car" })).toBeInTheDocument();
  });

  it("switches loan type without crashing", () => {
    render(<LoanModule />);

    fireEvent.click(screen.getByRole("button", { name: "Car" }));

    expect(screen.getByText("Loan amount")).toBeInTheDocument();
  });
});
