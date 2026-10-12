import { BrowserWindow, nativeTheme, screen } from 'electron';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_SIZE, MIN_SIZE, sanitizeWindowState, type WindowState } from './window-state';

/**
 * 标题栏高度（与 Renderer 的 --titlebar-h 一致）。设置 titleBarOverlay.height 后，Electron 会把红绿灯
 * 精确地垂直居中在这一高度内（中心 = 22px），Renderer 的窗口按钮与内容面板顶栏也以同一中线对齐。
 */
export const TITLEBAR_HEIGHT = 44;
/** 红绿灯按钮高 14px，顶边 y 使其垂直居中在标题栏内。 */
const TRAFFIC_LIGHT_Y = (TITLEBAR_HEIGHT - 14) / 2;

/**
 * 主窗口（规范 §4.7 的安全设置 + 桌面化外观）：
 * - macOS：隐藏标题栏，红绿灯在 44px 标题栏（与标签栏同一行）内垂直居中；
 * - 窗口底色为实色，与 Renderer 的 --chrome 一致（含深色模式），首帧前不闪浅色；
 * - 记住窗口位置、大小与最大化状态。
 */
/** 与 @diotia/ui 的 --chrome（浅色 / 深色）保持一致。 */
const CHROME_LIGHT = '#efeff0';
const CHROME_DARK = '#09090a';

function readSavedState(stateFile: string): WindowState | null {
  try {
    return sanitizeWindowState(
      JSON.parse(readFileSync(stateFile, 'utf8')),
      screen.getAllDisplays().map((d) => d.workArea),
    );
  } catch {
    return null;
  }
}

export function createMainWindow(opts: {
  userDataDir: string;
  preload: string;
  isDev: boolean;
  /** 仅开发 / E2E：不显示窗口、不抢焦点（窗口照常加载与渲染）。 */
  headless?: boolean;
}): BrowserWindow {
  const stateFile = join(opts.userDataDir, 'window-state.json');
  const saved = readSavedState(stateFile);

  const isMac = process.platform === 'darwin';
  const win = new BrowserWindow({
    ...(saved
      ? { x: saved.x, y: saved.y, width: saved.width, height: saved.height }
      : DEFAULT_SIZE),
    minWidth: MIN_SIZE.width,
    minHeight: MIN_SIZE.height,
    show: false,
    title: 'Diotia',
    ...(isMac
      ? {
          titleBarStyle: 'hidden' as const,
          // x：红绿灯距窗口左缘；y：红绿灯（高 14px）顶边，使其中心落在标题栏中线 (44 - 14) / 2 = 15。
          // 不依赖 titleBarOverlay.height 的自动居中：标题栏改高后，y 必须同步修改。
          trafficLightPosition: { x: 18, y: TRAFFIC_LIGHT_Y },
          titleBarOverlay: { height: TITLEBAR_HEIGHT },
        }
      : {}),
    backgroundColor: nativeTheme.shouldUseDarkColors ? CHROME_DARK : CHROME_LIGHT,
    webPreferences: {
      preload: opts.preload,
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      spellcheck: false,
      devTools: opts.isDev,
      // 不显示的窗口默认会被节流（动画帧暂停），E2E 需要测量过渡动画。
      backgroundThrottling: !opts.headless,
    },
  });
  if (saved?.maximized) win.maximize();

  let timer: NodeJS.Timeout | undefined;
  const persist = () => {
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
    const b = win.getNormalBounds();
    try {
      writeFileSync(stateFile, JSON.stringify({ ...b, maximized: win.isMaximized() }));
    } catch {
      // 写入失败不影响使用，下次以默认尺寸打开
    }
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(persist, 400);
  };
  win.on('resize', schedule);
  win.on('move', schedule);
  win.on('close', () => {
    clearTimeout(timer);
    persist();
  });
  if (!opts.headless) win.once('ready-to-show', () => win.show());
  return win;
}
