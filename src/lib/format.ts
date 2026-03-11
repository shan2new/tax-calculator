export const fINR = (n: number): string =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

export const fShort = (n: number): string => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`;
  return fINR(n);
};

export const toINRCommas = (s: string): string => {
  const d = s.replace(/[^0-9]/g, "");
  if (!d) return "";
  if (d.length <= 3) return d;
  let r = d.slice(-3);
  let rem = d.slice(0, -3);
  while (rem.length > 2) {
    r = rem.slice(-2) + "," + r;
    rem = rem.slice(0, -2);
  }
  if (rem) r = rem + "," + r;
  return r;
};

export const parseINRInput = (s: string): number => {
  const c = s.replace(/[₹,\s]/g, "").toLowerCase();
  const n = parseFloat(c.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return NaN;
  if (c.includes("cr")) return n * 1e7;
  if (c.includes("l")) return n * 1e5;
  return n;
};

export const humanHint = (n: number): string => {
  if (isNaN(n) || n === 0) return "";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (n >= 1000) return fINR(n);
  return `₹${n}`;
};
