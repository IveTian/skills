/**
 * 界面主题的深浅模式（ADR 0019）。
 * Renderer 按用户 / Workspace 主题决定使用浅色还是深色变量，经 nativeTheme.themeSource 生效
 * （同时影响 CSS prefers-color-scheme、原生菜单与滚动条）。
 *
 * 「跟随系统」需要知道系统本身的外观，而 themeSource 被强制为 light / dark 后，
 * nativeTheme.shouldUseDarkColors 反映的是强制值。所以：
 * - macOS 读取用户默认值 AppleInterfaceStyle（不受 themeSource 影响），并订阅系统外观变化通知；
 * - 其他平台只在 themeSource 为 system 时采样 shouldUseDarkColors，强制期间沿用最后一次的值。
 */
export type ThemeSource = 'system' | 'light' | 'dark';

export type AppearanceDeps = {
  platform: string;
  nativeTheme: {
    themeSource: ThemeSource;
    readonly shouldUseDarkColors: boolean;
    on(event: 'updated', cb: () => void): unknown;
  };
  /** macOS：systemPreferences.getUserDefault('AppleInterfaceStyle', 'string')。 */
  macInterfaceStyle?: () => string;
  /** macOS：订阅 AppleInterfaceThemeChangedNotification。 */
  subscribeMacThemeChange?: (cb: () => void) => void;
  onSystemChange: (systemDark: boolean) => void;
};

export function createAppearance(deps: AppearanceDeps) {
  const mac = deps.platform === 'darwin' && deps.macInterfaceStyle;
  const read = () =>
    mac ? deps.macInterfaceStyle!() === 'Dark' : deps.nativeTheme.shouldUseDarkColors;
  let systemDark = read();

  const refresh = () => {
    if (!mac && deps.nativeTheme.themeSource !== 'system') return;
    const next = read();
    if (next !== systemDark) {
      systemDark = next;
      deps.onSystemChange(next);
    }
  };
  deps.nativeTheme.on('updated', refresh);
  if (mac) deps.subscribeMacThemeChange?.(refresh);

  return {
    systemDark: () => systemDark,
    set(scheme: ThemeSource) {
      if (deps.nativeTheme.themeSource !== scheme) deps.nativeTheme.themeSource = scheme;
      refresh();
      return { systemDark };
    },
  };
}
