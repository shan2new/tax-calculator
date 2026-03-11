let _inp: HTMLInputElement | null = null;
let _last = 0;

function fire(w: "light" | "medium" | "heavy" = "light") {
  const now = performance.now();
  if (now - _last < 40) return;
  _last = now;

  if (navigator.vibrate) {
    const durations = { light: 1, medium: 3, heavy: 6 };
    navigator.vibrate(durations[w] || 1);
    return;
  }

  // iOS Safari checkbox trick
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    try {
      if (!_inp) {
        _inp = document.createElement("input");
        _inp.type = "checkbox";
        _inp.style.cssText =
          "position:fixed;top:-100px;opacity:0;pointer-events:none;width:0;height:0;";
        _inp.setAttribute("aria-hidden", "true");
        document.body.appendChild(_inp);
      }
      _inp.checked = !_inp.checked;
      void _inp.offsetHeight;
    } catch {
      // silently fail
    }
  }
}

export const Haptic = {
  light: () => fire("light"),
  medium: () => fire("medium"),
  heavy: () => fire("heavy"),
};
