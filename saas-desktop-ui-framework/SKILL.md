---
name: saas-desktop-ui-framework
description: 一套可复用的 SaaS 桌面端（Electron + React）界面框架：Linear 风格的视觉语言、三层设计变量、无标题栏窗口外壳（实色窗口底 + 圆角内容面板 + 侧栏 + Chrome 式标签栏）、基于 Base UI 的组件库与设置页版式，以及用 ESLint / 单元测试 / E2E 强制执行的规则。Use when building or restyling a desktop SaaS app (Electron, Tauri, or a desktop-like web app), setting up a design system / design tokens, sidebar + panel window layout, tab strip, command palette, settings pages, theme editor, or when the user asks to reuse "这套桌面端样式 / 设计 / 框架" in another app.
metadata:
  author: Patrick Tien
  version: "1.0.0"
  origin: Diotia 桌面端（agent-playground 仓库，ADR 0006–0011、0018、0019）
---

# SaaS Desktop UI Framework

把一个 SaaS 产品做成「像原生桌面应用」而不是「装在窗口里的网页」。这套框架来自 Diotia 桌面端的实际落地：视觉细节对照 Linear 实测，窗口结构取 Cursor / Linear / ChatGPT 桌面端的共通之处，标签栏交互对照 Chrome。

## 什么时候用

- 新建一个桌面 SaaS 应用（Electron 优先；Tauri / 浏览器内桌面式应用同样适用，窗口部分需替换）
- 给已有应用换成这套视觉与窗口结构
- 新增组件、页面、设置页、主题能力时，需要遵守同一套规则
- 审查界面代码是否偏离规范（写死颜色、用原生控件、侧栏用实色悬停……）

## 交付物一览

| 路径 | 内容 | 用法 |
| --- | --- | --- |
| `assets/ui-kit/` | 完整组件库源码（Base UI 封装 + `styles.css` + 三层设计变量） | 复制为新项目的 `packages/ui`，改包名 |
| `assets/desktop-shell/main/` | Electron 主窗口、窗口状态、原生菜单、深浅模式 | 参考实现，按新应用改命令与文案 |
| `assets/desktop-shell/renderer/` | 窗口框架、面板顶栏、标签栏、侧栏、命令面板、设置页部件、外壳 CSS | 参考实现；依赖原项目的路由 / 查询，需改接线 |
| `assets/theme/` | 自定义主题模型与 OKLCH 推导、运行时应用 | 需要主题编辑器时使用 |
| `assets/guardrails/` | 禁用原生组件的 ESLint 规则、设计变量三层约束测试 | 第一天就接入 |

## 工作流程

### A. 新应用从零接入

1. **复制组件库**：`assets/ui-kit/` → `packages/ui`，包名改为 `@<scope>/ui`；`tsconfig.json` 的 `extends` 改成新仓库的基础配置。依赖用精确版本（见 [references/04-components.md](references/04-components.md#依赖)）。
2. **图标库决策**：`icons.tsx` 映射到付费的 `nucleo-micro-bold`。新应用若无 Nucleo 授权，改为映射到其他图标库，**保留出口语义名**（`Icons.Search`、`Icons.Plus`…），业务代码不感知图标库。
3. **品牌色**：只改基础层 `--color-indigo-*`（或新增品牌色板）与语义层 `--accent*` 的引用；不要在组件里改色。
4. **接入守护规则**：把 `assets/guardrails/native-ui-bans.eslint.js` 合进 ESLint；把 `tokens.test.ts` 的 `FILES` 改为新项目的样式文件路径并纳入单元测试。
5. **搭窗口外壳**：按 [references/03-window-shell.md](references/03-window-shell.md) 搭 Main 窗口（无标题栏、实色底、红绿灯定位、窗口状态）与 Renderer 框架（标题栏 + 侧栏 + 内容面板）。
6. **按模式写页面**：侧栏信息架构、空状态输入框、命令面板、右侧属性卡片、设置页等见 [references/05-patterns.md](references/05-patterns.md)。
7. **验证**：lint、typecheck、单元测试（含 tokens 约束）、E2E 几何断言；视觉交给产品负责人人工确认（见 [references/06-guardrails.md](references/06-guardrails.md)）。

### B. 在已接入的应用里加东西

1. 先找现成组件（[组件清单](references/04-components.md)）。没有就组合已有组件；**真的要新组件，先停下来问产品负责人**。
2. 先找现成变量。语义层没有对应用途 → 判断是通用（加语义变量）还是组件专用（加组件变量）；基础层没有的值才加基础层（[references/02-design-tokens.md](references/02-design-tokens.md)）。
3. 写完跑 tokens 约束测试与 lint。

## 硬规则（不可违反）

1. **只用组件库**：业务层不得直接写 `button / input / textarea / select / dialog / details / form / label …`，不得在原生元素上用 `title`，不得调用 `alert / confirm / prompt`。全部走 Base UI 封装（Tooltip、ConfirmDialog、Toast…）。
2. **新增组件须经产品负责人确认**。页面版式（设置页的卡片 / 行等）用已有组件组合，留在应用侧，不进入组件库。
3. **样式不写字面量**：组件样式只引用语义层与组件层变量，不写颜色、长度、时长、缓动、字号 / 字重 / 行高、非 0/1 的透明度与缩放；也不直接引用基础层。`.tsx` 里不写颜色、SVG 尺寸、带数值的内联样式（运行时变量如 `--tab-count` 例外，须登记）。
4. **深色模式只在语义层赋值**，组件层与组件样式不感知明暗。
5. **侧栏（实色 `--chrome` 底）上的悬停 / 选中 / 按下只用半透明叠加色**（`--chrome-hover / selected / active`），不得用实色；整行承担填充时内部按钮保持透明，避免叠加变深。
6. **全局不显示键盘焦点环**（产品决定）。输入框聚焦以边框变色表示。不要擅自加回；需要恢复时只改 `styles.css` 的全局规则。
7. **浮层不加粗描边**：菜单、命令面板、对话框、抽屉用圆角 + 极淡阴影 + 0.5px 浮层描边区分层次；全站细线统一 0.5px。
8. **主进程窗口底色必须与 `--chrome` 一致**（浅色 / 深色），由测试保证，否则首帧闪色。
9. **桌面安全不让步**：不关 `sandbox` / `contextIsolation`；Renderer 只经 preload 暴露的对象调用 Main；新增 IPC 进白名单并校验参数。
10. **不做视觉自检**：开发者 / agent 不截图、不启动模拟器做视觉判断；只跑编译与自动化测试（含 E2E 几何测量），并告诉产品负责人看哪里、怎么打开。

## 视觉速记（详见 [01-design-language.md](references/01-design-language.md)）

- 字体 Inter（随包打包，不请求网络），中文回落苹方 / 微软雅黑；正文 13px / 450，强调 500，标题 600。
- 两层表面：窗口底 `#efeff0` → 内容面板 `#f9f9fa`（圆角 12、距窗口 8px）→ 卡片 / 浮层白色。
- 强调色靛蓝 `#6d78d5`，只用于主操作、发送与选中。
- 控件高 28 / 32 / 40，圆角 8；图标 14px 放进 16px 图标位。
- 悬停底色立即出现、移开 150ms 淡出；快速过渡 100ms、常规 250ms、布局 300ms `cubic-bezier(0.22, 1, 0.36, 1)`；尊重 `prefers-reduced-motion`。

## 参考文档

- [01-design-language.md](references/01-design-language.md) — 视觉语言：字体、颜色、线与阴影、尺寸表、动效
- [02-design-tokens.md](references/02-design-tokens.md) — 三层设计变量的结构、命名与新增流程
- [03-window-shell.md](references/03-window-shell.md) — 窗口外壳：标题栏几何、侧栏开合、内容面板、标签栏、原生菜单与快捷键
- [04-components.md](references/04-components.md) — 组件清单、规格、Base UI 映射、依赖、准入规则
- [05-patterns.md](references/05-patterns.md) — 信息架构与页面模式：侧栏、空状态输入框、命令面板、右侧属性卡片、设置页、主题编辑器
- [06-guardrails.md](references/06-guardrails.md) — ESLint、tokens 约束测试、E2E 几何断言、交付检查清单
