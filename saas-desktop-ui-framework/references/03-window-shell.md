# 03 · 窗口外壳

参考实现：`assets/desktop-shell/main/window.ts`、`window-state.ts`、`menu.ts`、`appearance.ts`；`assets/desktop-shell/renderer/AppFrame.tsx`、`PanelHeader.tsx`、`TabStrip.tsx`、`tabs.ts`、`frame-context.tsx`、`shell.css`。

## 整体结构

```
┌────────────────────────── 标题栏 44px（可拖动）──────────────────────────┐
│ ●●●  [⊟]      [‹][›] │ [标签页][标签页][标签页]  +                          │  ← 中线 22px
├──────────────────────┬───────────────────────────────────────────────────┤
│ 侧栏 238px            │ ┌─ 内容面板（--canvas，圆角 12，0.5px 描边）───────┐ │
│ （实色 --chrome 底）   │ │ 面板顶栏 44px（可拖动）  leading | center | trailing│ │
│ Workspace 选择器       │ │                                                │ │
│ 主动作：新建 / 搜索 / …│ │                视图（每个标签页常驻）              │ │
│ 分组列表               │ │                                                │ │
│                       │ └────────────────────────────────────────────────┘ │
└──────────────────────┴───────────── 面板距窗口右 / 下 8px ──────────────────┘
```

DOM：

```tsx
<div className="frame">                       {/* 100vh，背景 --chrome */}
  <header className="titlebar ui-drag">        {/* 44px；侧栏展开时 padding-left = 侧栏宽 */}
    <TabStrip />
  </header>
  <div className="frame-body">                 {/* flex 行 */}
    <div className="sidebar-shell t-resize">   {/* 238 ↔ 8，过渡宽度 */}
      <Sidebar />                              {/* 内部固定 238，被裁切而不是重排 */}
    </div>
    <main className="panel">…每个标签页一个 .tab-page，只显示当前…</main>
  </div>
  <WindowControls />                           {/* position: fixed，侧栏开关 + 后退 / 前进 */}
  <CommandMenu />
</div>
```

## Main 进程窗口

```ts
export const TITLEBAR_HEIGHT = 44;                // 与 Renderer 的 --titlebar-h 一致
const TRAFFIC_LIGHT_Y = (TITLEBAR_HEIGHT - 14) / 2; // 红绿灯高 14，垂直居中
const CHROME_LIGHT = '#efeff0';                   // 与 --chrome 一致（测试保证）
const CHROME_DARK = '#09090a';

new BrowserWindow({
  ...savedOrDefault,                              // 默认 1280×820，最小 900×600
  show: false,                                    // ready-to-show 后再显示
  ...(isMac ? {
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: TRAFFIC_LIGHT_Y },
    titleBarOverlay: { height: TITLEBAR_HEIGHT },
  } : {}),
  backgroundColor: nativeTheme.shouldUseDarkColors ? CHROME_DARK : CHROME_LIGHT,
  webPreferences: { preload, sandbox: true, contextIsolation: true, nodeIntegration: false, webSecurity: true, spellcheck: false },
});
```

要点：

- **不用 `vibrancy` 半透明材质**，窗口底是实色（产品决定，跨平台一致且好控制）。
- **标题栏改高时必须同步**：`TITLEBAR_HEIGHT`、`trafficLightPosition.y`、CSS `--titlebar-h`。
- **窗口状态**：`window-state.json` 存 `x/y/width/height/maximized`；resize / move 防抖 400ms 写入，close 时立即写；恢复前用 Zod 校验格式，并检查窗口至少 100×50 落在某个显示器工作区内（外接显示器拔掉时回到默认尺寸）。全屏 / 最小化时不保存。
- Renderer 在 `<html data-platform="darwin">` 上标记平台，用于 macOS 专属几何。

## 标题栏几何

- 一整行 44px，红绿灯、窗口按钮组、标签栏**共用 22px 中线**。
- 窗口按钮组 `.window-controls`：`position: fixed; top: 0; height: var(--titlebar-h)`；macOS 下 `left: 84px`（红绿灯右缘 72 + 12；系统给的 `env(titlebar-area-x)` 约 96px，留白过多），其他平台 `left: 12px`。
  - 收起时宽 = 三个按钮（88px）；展开时右缘对齐侧栏内容右缘，后退 / 前进随宽度过渡滑到侧栏右侧；侧栏开关位置不动。
  - 窗口按钮悬停 / 按下不铺底色，只靠图标变深。
- 标签栏：侧栏展开时从内容面板左缘开始（`padding-left: var(--sidebar-width)`），收起时紧跟窗口按钮组右缘 + 12px；与侧栏同一过渡。
- **拖动区**：`.ui-drag { -webkit-app-region: drag }`，其中 `button / input / [role=button|group|tab] / a` 自动 `no-drag`。标题栏、面板顶栏都是拖动区；按钮之间的空白也能拖窗口。

## 侧栏开合

- 外壳 `.sidebar-shell.t-resize` 在 `--sidebar-width`（238）↔ `--panel-gap`（8，即收起后面板的左间隙）之间过渡宽度，300ms `cubic-bezier(0.22, 1, 0.36, 1)`；内部侧栏保持 238 宽被裁切，不重排。
- 收起动画结束后才 `visibility: hidden`（`transition: visibility 0s linear var(--resize-dur)`）——不可点、不可 Tab、读屏不读；展开时立即可见。
- 侧栏开关图标 `SidebarIcon`：内侧竖条用 CSS `d` 属性过渡（展开实心块 → 收起一条线），与外壳同步，可中途反向；右侧栏开关用同一图标镜像（`data-side="right"`）。
- 快捷键 ⌘\ 切换左侧栏，⇧⌘\ 切换右侧栏（档案 / 属性面板）。
- `prefers-reduced-motion` 下直接切换（无中间帧）。
- 侧栏首行中线与面板顶栏中线对齐：侧栏 `padding-top: 8`、行高 28 → 8 + 14 = 22 ≈ 0.5 + 22（面板描边 + 顶栏中线）。

## 内容面板

```css
.panel {
  flex: 1; margin: 0 var(--panel-gap) var(--panel-gap) 0;
  background: var(--canvas);
  border: var(--border-width) solid var(--canvas-border);
  border-radius: var(--panel-radius);   /* 12 */
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}
```

面板顶栏 `PanelHeader`：44px，`grid-template-columns: minmax(0,1fr) auto minmax(0,1fr)`（leading / center / trailing 三段），可拖动窗口；可选 `bordered` 下边线。顶栏里的可点标题 / 面包屑是 28px 胶囊安静按钮，当前项正文色，其余次要色，分隔符 12px 弱色 ›。

全窗口页面（设置、新建 Workspace）打开时**隐藏窗口框架但保持挂载**（`<div className="frame" hidden>`），返回后标签页与页面状态不变。

## 标签栏（交互对照 Chrome）

模型 `tabs.ts`（纯函数 reducer，单元测试覆盖）：每个标签页有独立的前进 / 后退历史，记录 opener；所有标签页内容常驻，只显示当前的，切换保留滚动与输入状态；标签页不跨重启保存。

| 操作 | 行为 |
| --- | --- |
| ⌘T、「+」 | 末尾新建「新建」页并切换 |
| ⌘ / Ctrl 点击、中键点击侧栏入口；右键「在新标签页中打开」 | 在当前标签页及其已打开的子标签页之后的后台新标签页打开；加 ⇧ 则切换过去 |
| 按下标签页 | 按下即选中（不等松开） |
| ⌘W、关闭按钮、中键点击 | 关闭；关闭当前后依次选同一 opener 的右侧兄弟 → opener → 右侧 → 左侧；最后一个关闭时关闭窗口 |
| ⌘⇧T | 按关闭顺序倒序重新打开，回到原位置并保留历史（最多 25 个） |
| ⌘1–⌘8 / ⌘9 | 按位置 / 最后一个 |
| ⌃Tab、⌃⇧Tab、⌘⌥→/←、⌘⇧]/[ | 下一个 / 上一个（循环） |
| 拖动 | 超过 4px 才算拖动；被拖的跟随指针（不过渡、浮在最上），其余让位过渡 250ms，松开落位；不支持拖出新窗口 |
| 右键 | 新标签页、复制、关闭、关闭其他、关闭右侧、重新打开关闭的标签页 |
| 宽度 | 等分可用宽度（最宽 220、最窄 40）；用鼠标关闭后宽度冻结直到指针离开标签栏（下一个关闭按钮正好落在指针下） |
| 变窄 | 容器查询：≤72px 非当前标签隐藏关闭按钮；≤48px 只留图标，当前标签只留关闭按钮；标题尾部 `mask-image` 淡出而非省略号 |
| 悬停 | 完整标题 Tooltip；关闭按钮在悬停与当前标签页上显示 |
| ⌘⇧W | 关闭窗口 |

外观：高 28、圆角 8、13px / 500、次要色；悬停 `--chrome-hover` + 正文色；当前标签 = 面板底色 `--canvas` + `0 0 0 0.5px var(--canvas-border)` + `--shadow-raised`。

## 原生菜单栏与快捷键

`menu.ts`：快捷键由原生菜单 accelerator 提供，点击后经**白名单 IPC**（命令枚举在合约里定义）发给 Renderer；Renderer 在 `AppFrame` 里一个 `switch` 分发。编辑菜单用系统 `role: 'editMenu'`，保证输入框复制粘贴撤销与系统一致。只要快捷键不需要显示的项用 `visible: false, acceleratorWorksWhenHidden: true`（如 ⌘1–⌘9）。

| 菜单 | 项 |
| --- | --- |
| 文件 | 新建标签页 ⌘T · 新建 <主对象> ⌘N · 新建 <子对象> ⇧⌘N · 重新打开关闭的标签页 ⇧⌘T · 关闭标签页 ⌘W · 关闭窗口 ⇧⌘W |
| 编辑 | 系统角色 |
| 显示 | 切换侧栏 ⌘\ · 切换右侧栏 ⇧⌘\ · 进入全屏 ·（开发）reload / devtools |
| 前往 | 搜索… ⌘K · 活动 ⇧⌘A · 后退 ⌘[ · 前进 ⌘] |
| 标签页 | 下一个 ⌃Tab · 上一个 ⌃⇧Tab · 复制标签页 · 隐藏的位置 / 循环快捷键 |
| 窗口 | 系统角色 |

## 深浅模式

- CSS 只靠 `prefers-color-scheme`；用户 / 工作区选择的深浅由 Main 设置 `nativeTheme.themeSource`（同时影响 CSS、原生菜单、滚动条）。白名单 IPC `appearance:set`（Zod 校验 `system | light | dark`）。
- 「跟随系统」需要知道系统本身的外观：强制 `themeSource` 后 `shouldUseDarkColors` 反映强制值，所以 macOS 读 `AppleInterfaceStyle` 并订阅 `AppleInterfaceThemeChangedNotification`；其他平台只在 `system` 时采样（见 `appearance.ts`）。
- 首帧前防闪：Main 的 `backgroundColor` 用 `--chrome` 同值；自定义主题缓存到本机 `localStorage`，启动时首帧前先应用。

## 其他桌面习惯

- 右键菜单（ContextMenu）：侧栏行、标签页都有；与顶栏「更多」菜单、详情面板共用同一套动作与确认流程（集中在一个 `XxxActionsProvider`）。
- 前进 / 后退历史：每个标签页独立。
- 窗口最小 900×600；窄窗口时右侧栏改为 Drawer（`useMediaQuery`）。
