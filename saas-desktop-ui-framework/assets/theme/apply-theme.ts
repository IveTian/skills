import {
  CustomTheme,
  resolveTheme,
  themeTokens,
  type ResolvedTheme,
  type ThemePreference,
  type WorkspaceAppearance,
} from '@diotia/contracts';
import { useEffect, useState } from 'react';
import { useMe } from './queries';

/**
 * 界面主题（ADR 0019）在 Renderer 中的应用：
 * - 生效主题由 /v1/me 中的个人偏好、Workspace 外观与系统外观计算（contracts resolveTheme）；
 * - 深浅模式交给 Main（nativeTheme.themeSource，影响 prefers-color-scheme 与原生控件）；
 *   与系统一致时设为 system，便于继续感知系统外观变化；
 * - 自定义主题在 <html> 上以内联样式覆盖少量语义层变量（themeTokens），移除即恢复内置主题；
 * - 最近一次生效的主题缓存在本机，下次启动在首帧前先应用，避免闪一下默认主题。
 */

const CACHE_KEY = 'diotia:theme';
let applied: string[] = [];

function applyTokens(custom: CustomTheme | null) {
  const root = document.documentElement;
  for (const name of applied) root.style.removeProperty(name);
  applied = [];
  if (custom) {
    for (const [name, value] of Object.entries(themeTokens(custom))) {
      root.style.setProperty(name, value);
      applied.push(name);
    }
  }
  root.dataset.theme = custom ? 'custom' : 'builtin';
}

function schemeSource(theme: ResolvedTheme, systemDark: boolean) {
  return theme.scheme === (systemDark ? 'dark' : 'light') ? 'system' : theme.scheme;
}

/** 首帧前应用上次的主题（读不到缓存时什么都不做，保持跟随系统）。 */
export function applyCachedTheme() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw) as { scheme?: unknown; custom?: unknown };
    const custom = cached.custom ? CustomTheme.safeParse(cached.custom) : null;
    if (cached.scheme !== 'light' && cached.scheme !== 'dark') return;
    applyTokens(custom?.success ? custom.data : null);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    void window.diotia.app.setAppearance(
      schemeSource({ scheme: cached.scheme, custom: null, enforced: false }, systemDark),
    );
  } catch {
    // 本机缓存不可用时直接使用默认主题。
  }
}

function rememberTheme(theme: ResolvedTheme | null) {
  try {
    if (theme)
      window.localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ scheme: theme.scheme, custom: theme.custom }),
      );
    else window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // 缓存只用于首帧，写不进去不影响功能。
  }
}

/** 系统本身是否为深色外观（不受 Diotia 强制深浅模式影响）。 */
export function useSystemDark() {
  // 启动时 themeSource 为 system（或已按缓存设置并在下面校正），以媒体查询作初值。
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  useEffect(() => window.diotia.app.onAppearanceChanged((v) => setSystemDark(v.systemDark)), []);
  return [systemDark, setSystemDark] as const;
}

/** 在登录后的窗口中挂载一次：随偏好、Workspace 外观与系统外观变化应用主题；注销时恢复默认。 */
export function useThemeController() {
  const me = useMe();
  const [systemDark, setSystemDark] = useSystemDark();
  const pref: ThemePreference | undefined = me.data?.preferences.theme;
  const ws: WorkspaceAppearance | undefined = me.data?.workspace.appearance;

  useEffect(() => {
    if (!pref || !ws) return;
    const theme = resolveTheme(pref, ws, systemDark);
    applyTokens(theme.custom);
    rememberTheme(theme);
    void window.diotia.app.setAppearance(schemeSource(theme, systemDark)).then((r) => {
      // 缓存的强制模式下媒体查询不代表系统外观，以 Main 返回的为准。
      if (r.ok && r.data.systemDark !== systemDark) setSystemDark(r.data.systemDark);
    });
  }, [pref, ws, systemDark, setSystemDark]);

  useEffect(
    () => () => {
      applyTokens(null);
      rememberTheme(null);
      void window.diotia.app.setAppearance('system');
    },
    [],
  );
}
