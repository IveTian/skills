/** 颜色换算（ColorPicker 用）：#rrggbb ↔ HSV（h 0–360，s / v 0–1）。 */
export type Hsv = { h: number; s: number; v: number };

export const HEX = /^#?([0-9a-f]{6})$/i;

/** 规范化为小写 #rrggbb；格式不对返回 null。 */
export function normalizeHex(input: string): string | null {
  const m = HEX.exec(input.trim());
  return m ? `#${m[1]!.toLowerCase()}` : null;
}

export function hexToHsv(hex: string): Hsv {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const f = (k: number) => {
    const x = (k + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(x, 4 - x, 1));
  };
  return `#${[f(5), f(3), f(1)]
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const percent = (x: number) => `${clamp01(x) * 100}%`;
