import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const gradientStub = {
  addColorStop: vi.fn(),
};

const canvasContextStub = {
  scale: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  setLineDash: vi.fn(),
  roundRect: vi.fn(),
  fillText: vi.fn(),
  createRadialGradient: vi.fn(() => gradientStub),
  createLinearGradient: vi.fn(() => gradientStub),
  shadowBlur: 0,
  shadowColor: "",
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 0,
  lineCap: "round",
  font: "",
  textAlign: "center",
  textBaseline: "middle",
};

Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => canvasContextStub),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: vi.fn((callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16)),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: vi.fn((id: number) => window.clearTimeout(id)),
});

Object.defineProperty(window.navigator, "vibrate", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.URL, "createObjectURL", {
  writable: true,
  value: vi.fn(() => "blob:mock"),
});

Object.defineProperty(window.URL, "revokeObjectURL", {
  writable: true,
  value: vi.fn(),
});
