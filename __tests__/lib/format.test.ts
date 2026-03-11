import {
  fINR,
  fShort,
  fShortStep,
  humanHint,
  parseINRInput,
  toINRCommas,
} from "@/lib/format";

describe("format", () => {
  it("formats INR with Indian commas", () => {
    expect(fINR(1234567)).toBe("₹12,34,567");
  });

  it("formats short lakh and crore values", () => {
    expect(fShort(500000)).toBe("₹5 L");
    expect(fShort(15000000)).toBe("₹1.5 Cr");
  });

  it("formats step-aware compact values", () => {
    expect(fShortStep(550000, 10000)).toBe("₹5.5 L");
  });

  it("adds Indian commas to numeric input strings", () => {
    expect(toINRCommas("1234567")).toBe("12,34,567");
  });

  it("parses plain, lakh, and crore input formats", () => {
    expect(parseINRInput("12,34,567")).toBe(1234567);
    expect(parseINRInput("50L")).toBe(5000000);
    expect(parseINRInput("1.5Cr")).toBe(15000000);
  });

  it("creates human-readable hints", () => {
    expect(humanHint(5000000)).toBe("₹50.00 L");
  });
});
