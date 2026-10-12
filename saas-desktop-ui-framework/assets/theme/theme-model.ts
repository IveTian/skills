import * as z from 'zod';

/**
 * 界面主题（ADR 0019）：
 * - 内置「浅色」「深色」；自定义主题只有三项：强调色、内容区背景色、组件（按钮）圆角；
 *   外层窗口底色、卡片底色、强调色的悬停 / 浅底 / 文字色都由 oklch 推导，深浅由背景亮度决定；
 * - 个人偏好：界面主题可选「跟随系统」或某个主题；跟随系统时分别指定浅色 / 深色外观下用哪个主题；
 * - Workspace 可以设一个自定义主题；管理员强制应用时，成员不能自行修改主题。
 */

export const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, '请填写 #RRGGBB 格式的颜色')
  .transform((v) => v.toLowerCase());

/** 组件圆角可选值（px）；999 为胶囊。 */
export const THEME_RADII = [0, 4, 6, 8, 10, 12, 999] as const;
export const ThemeRadius = z
  .int()
  .refine((v) => (THEME_RADII as readonly number[]).includes(v), '不支持的圆角');

export const CustomTheme = z.strictObject({
  accent: HexColor,
  background: HexColor,
  radius: ThemeRadius,
});
export type CustomTheme = z.infer<typeof CustomTheme>;

/** 与内置浅色主题一致的初始值（强调色 indigo-500、内容区 gray-25、按钮圆角 8）。 */
export const DEFAULT_CUSTOM_THEME: CustomTheme = {
  accent: '#6d78d5',
  background: '#f9f9fa',
  radius: 8,
};

/** 可选的主题：内置浅色 / 深色、我的自定义主题、当前 Workspace 的主题。 */
export const ThemeChoice = z.enum(['light', 'dark', 'custom', 'workspace']);
export type ThemeChoice = z.infer<typeof ThemeChoice>;

export const ThemePreference = z.strictObject({
  mode: z.enum(['system', 'light', 'dark', 'custom', 'workspace']),
  /** 跟随系统时：系统为浅色外观用哪个主题。 */
  light: ThemeChoice,
  /** 跟随系统时：系统为深色外观用哪个主题。 */
  dark: ThemeChoice,
  custom: CustomTheme,
});
export type ThemePreference = z.infer<typeof ThemePreference>;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = {
  mode: 'system',
  light: 'light',
  dark: 'dark',
  custom: DEFAULT_CUSTOM_THEME,
};

/** Workspace 外观：没有设置时 theme 为 null、revision 为 0。强制应用必须有主题。 */
export const WorkspaceAppearance = z.strictObject({
  theme: CustomTheme.nullable(),
  enforced: z.boolean(),
  revision: z.int().min(0),
});
export type WorkspaceAppearance = z.infer<typeof WorkspaceAppearance>;

export const UpdateWorkspaceAppearanceBody = z
  .strictObject({
    theme: CustomTheme.nullable(),
    enforced: z.boolean(),
    revision: z.int().min(0),
  })
  .refine((b) => !b.enforced || b.theme !== null, {
    message: '强制应用需要先设置 Workspace 主题',
    path: ['enforced'],
  });

// ---------------------------------------------------------------------------
// 颜色计算（OKLab / OKLCH，Björn Ottosson 公式）
// ---------------------------------------------------------------------------

export type Oklch = { l: number; c: number; h: number };

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

export function hexToOklch(hex: string): Oklch {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = toLinear(((n >> 16) & 255) / 255);
  const g = toLinear(((n >> 8) & 255) / 255);
  const b = toLinear((n & 255) / 255);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, d: number) => Number(v.toFixed(d));

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(clamp(l, 0, 1), 4)} ${round(Math.max(0, c), 4)} ${round(h, 2)})`;
}

/** 背景亮度低于这个值时按深色主题处理（文字、边框等使用深色模式的变量）。 */
export const DARK_BACKGROUND_L = 0.6;

export function themeScheme(theme: CustomTheme): 'light' | 'dark' {
  return hexToOklch(theme.background).l < DARK_BACKGROUND_L ? 'dark' : 'light';
}

/**
 * 自定义主题 → 覆盖的语义层 / 组件层变量。
 * - 内容区（--surface-canvas）= 背景色；外层窗口（--surface-window / --ground）同色相、亮度低一些；
 * - 卡片与浮层（--surface）比内容区亮一点（浅色背景接近白色）；
 * - 强调色：悬停在浅色主题变深、深色主题变亮；浅底与文字色按深浅取亮度；按钮文字黑白二选一。
 */
export function themeTokens(theme: CustomTheme): Record<string, string> {
  const bg = hexToOklch(theme.background);
  const ac = hexToOklch(theme.accent);
  const dark = bg.l < DARK_BACKGROUND_L;
  const shade = (dl: number, cScale = 1) =>
    formatOklch({ l: bg.l + dl, c: bg.c * cScale, h: bg.h });
  const radius = `${theme.radius}px`;
  return {
    '--surface-canvas': formatOklch(bg),
    '--surface-window': shade(dark ? -0.03 : -0.035),
    '--ground': shade(dark ? -0.03 : -0.035),
    '--surface': dark ? shade(0.035) : shade(Math.min(0.025, 1 - bg.l), 0.5),
    '--surface-raised': dark ? shade(0.06) : shade(-0.012),
    '--sunken': dark ? shade(0.06) : shade(-0.035),
    '--accent': formatOklch(ac),
    '--accent-hover': formatOklch({ ...ac, l: ac.l + (dark ? 0.06 : -0.06) }),
    '--accent-soft': formatOklch(
      dark ? { l: 0.3, c: ac.c * 0.4, h: ac.h } : { l: 0.95, c: ac.c * 0.25, h: ac.h },
    ),
    '--accent-ink': formatOklch(
      dark
        ? { l: Math.max(ac.l, 0.8), c: ac.c * 0.7, h: ac.h }
        : { l: Math.min(ac.l, 0.5), c: ac.c, h: ac.h },
    ),
    '--on-accent': ac.l < 0.72 ? 'oklch(1 0 0)' : 'oklch(0.2 0 0)',
    '--button-radius': radius,
    '--button-radius-lg': radius,
  };
}

/** 实际生效的主题。scheme 决定使用浅色还是深色模式的变量；custom 非空时再覆盖上面的变量。 */
export type ResolvedTheme = {
  scheme: 'light' | 'dark';
  custom: CustomTheme | null;
  /** Workspace 强制应用了主题（成员不能自行修改）。 */
  enforced: boolean;
};

export function resolveTheme(
  pref: ThemePreference,
  workspace: Pick<WorkspaceAppearance, 'theme' | 'enforced'>,
  systemDark: boolean,
): ResolvedTheme {
  if (workspace.enforced && workspace.theme)
    return { scheme: themeScheme(workspace.theme), custom: workspace.theme, enforced: true };
  const choice: ThemeChoice =
    pref.mode === 'system' ? (systemDark ? pref.dark : pref.light) : pref.mode;
  const custom =
    choice === 'custom' ? pref.custom : choice === 'workspace' ? workspace.theme : null;
  if (custom) return { scheme: themeScheme(custom), custom, enforced: false };
  // Workspace 主题已被删除时，回到与系统一致的内置主题。
  const scheme = choice === 'light' || choice === 'dark' ? choice : systemDark ? 'dark' : 'light';
  return { scheme, custom: null, enforced: false };
}
