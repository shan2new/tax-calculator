export const APP_STORAGE_KEYS = {
  theme: "claros_theme",
  welcomed: "claros_welcomed",
} as const;

export const APP_MAX_CONTENT_WIDTH = 400;

export const LOAN_VIEW_COUNT = 3;
export const TAX_HERO_VIEW_COUNT = 3;

export const VIEW_SWAP_DELAY_MS = 110;
export const SCRUB_TICK_PULSE_MS = 180;
export const SCRUB_RELEASE_FLASH_MS = 220;
export const VERDICT_PULSE_MS = 240;
export const WELCOME_REVEAL_DELAY_MS = 300;
export const WELCOME_DISMISS_DELAY_MS = 400;
export const SHARE_TOAST_MS = 2000;

export const SCRUB_INTENT_PX = 6;
export const MOMENTUM_MIN_VELOCITY = 0.22;
export const MOMENTUM_DECAY_PER_FRAME = 0.88;
export const SETTLE_K = 210;
export const SETTLE_B = 34;

export const LOAN_CONTROL_CONFIG = {
  amount: {
    sensitivity: 1.8,
  },
  rate: {
    sensitivity: 0.35,
    tickStep: 1,
  },
  tenure: {
    sensitivity: 0.25,
    tickStep: 1,
  },
} as const;

export const TAX_CONTROL_CONFIG = {
  income: {
    step: 50000,
    sensitivity: 2,
    tickStep: 500000,
  },
  deductions: {
    step: 10000,
    sensitivity: 1,
    tickStep: 50000,
  },
} as const;
