# 04 · 组件库

源码：`assets/ui-kit/src/`。导出入口 `index.ts`；全部样式在 `styles.css`（唯一视觉来源，应用侧 CSS 只做布局）；组件类名统一 `ui-<组件>` / `ui-<组件>--<变体>` / `ui-<组件>__<部件>`。

## 底层选择

- **Base UI**（`@base-ui/react`，无样式、可访问性完备）作为所有交互组件的底座，再做风格化封装。不用 Radix / shadcn / Tailwind 体系（与 Base UI 冲突）。
- 先找成熟开源构件再定制：Markdown 用 `react-markdown` + `remark-gfm` + `remend`（流式补全）；聊天贴底滚动用 `use-stick-to-bottom`。不引入整套聊天框架。
- 图表：手写 SVG，不引入图表库。
- 代码高亮 / diff：暂未引入，需要时评估。

## 依赖

精确版本（来源项目锁定，新项目可升级但须写精确版本）：

| 包 | 版本 |
| --- | --- |
| `@base-ui/react` | 1.9.0 |
| `@fontsource-variable/inter` | 5.3.0 |
| `nucleo-micro-bold` | 1.2.1（付费授权；安装前脚本只做授权校验，pnpm 默认不执行依赖脚本，不要把授权码写进仓库） |
| `react-markdown` | 10.1.0 |
| `remark-gfm` | 4.0.1 |
| `remend` | 1.3.1 |
| `use-stick-to-bottom` | 1.1.6 |
| `react` / `react-dom`（peer） | 19.3.0 |

## 组件清单

| 组件 | Base UI 底座 | 说明 |
| --- | --- | --- |
| `Button` | Button | 变体：`primary` 主按钮 · `secondary` 次要（默认）· `ghost` 文字 · `quiet` 安静 · `danger` / `danger-solid` · `card` 卡片 · `item` 列表项 · `icon` · `chip`（输入框内胶囊）· `send` · `sidebar`；尺寸 `sm 28 / md 32 / lg 40`；`loading` 显示转圈并禁用但保留可读文本 |
| `IconButton` | Button + Tooltip | 28px 圆形；必须给 `label`（作为 aria-label 与提示），可带 `shortcut` |
| `Form` | Form | 自带 `noValidate`，无浏览器校验气泡 |
| `TextField` | Field（Label + Control + Description + Error） | `multiline` 时 `Field.Control render={<textarea/>}`；`validate` 返回错误文案或 null |
| `ColorPicker` | Popover + Slider + Field | 色块在左、HEX 在右；饱和度 / 亮度面板（方向键，Shift 10%）+ 色相滑杆；拖动只预览，松开 / 回车 / 失焦才提交 |
| `Composer` | Field | 大输入框：自动增高（`field-sizing: content`，最高 240）；上方上下文选择、下方提示；运行中发送按钮变停止按钮 |
| `Markdown` / `safeMarkdownUrl` | — | 不渲染原始 HTML；链接只允许 http / https / mailto 并交给 Main 打开；不加载远程图片 |
| `ChatLog` / `ChatMessage` / `RunLine` | — | 消息列表贴底滚动 + 「跳到底部」；用户消息右侧浅灰气泡（最宽 85%），助手回复通栏无气泡；运行状态行 |
| `Tag` / `CountTag` | — | 状态标签（带圆点）/ 计数 |
| `Tooltip` | Tooltip | 白底、0.5px 描边、11px；取代原生 `title` |
| `RelativeTime` / `relativeTime` | Tooltip | 相对时间，悬停显示完整时间 |
| `LoadingState` / `EmptyState` / `ErrorState` | — | 状态区块（骨架 / 空 / 错误 + 重试） |
| `Dialog` / `DialogFooter` / `ConfirmDialog` | Dialog / AlertDialog | 确认类操作一律 ConfirmDialog，取代 `confirm()` |
| `Drawer` | Dialog | 窄窗口下的侧栏 / 详情 |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | Tabs | 页面内标签（含竖排） |
| `SegmentedControl` | ToggleGroup | 模式切换（如「对话 \| 调整」） |
| `Menu` 系列 | Menu | `MenuTrigger / MenuContent / MenuItem / MenuHeader / MenuSeparator / MenuSubmenu / MenuSubmenuTrigger / MenuRadioGroup / MenuRadioItem(closeOnClick, disabled)`；`Avatar` |
| `ContextMenu` 系列 | ContextMenu | 右键菜单，与 Menu 同外观 |
| `CommandPalette` | Dialog + Autocomplete(inline) | ⌘K；分组、键盘导航、回车执行 |
| `SidebarSection` / `SidebarItem` / `SidebarTreeItem` / `StatusDot` | Collapsible + Button | 侧栏分组（可折叠，右侧可放操作）、导航行（图标 + 文本 + 行尾信息 / 快捷键，`tone: default/primary/child/muted`）、可展开树行（展开按钮与选择按钮分开；`onSelect` 接收鼠标事件以判断新标签页打开）、状态点 |
| `SidebarIcon` | — | 侧栏开关图标（竖条随开合过渡；`side="right"` 镜像） |
| `SideCard` / `PropertyRow` | Collapsible | 右侧栏属性卡片（标题行可折叠）与「标签：值」行 |
| `ScrollArea` | ScrollArea | 细滚动条（8px，半透明灰） |
| `useToast` / Toast | Toast | 浮层底色 + 弹层阴影；成功 / 失败只靠图标颜色区分 |
| `Collapsible` 系列 / `Separator` | Collapsible / Separator | |
| `UIProvider` | — | 挂载 Toast 等全局 Provider |
| `useMediaQuery` | — | 断点切换（如右侧栏 → Drawer） |
| `Icons` | — | 语义名出口：`Search Plus SquarePen Inbox Archive Bot MessageSquare ChevronLeft/Right/Down CaretDown/Right Check CircleCheck CircleX Ellipsis X ArrowUp/Down Stop Retry Cloud Computer Shield MonitorSmartphone`；设置导航用实心：`Gear CircleUserFilled ShieldFilled HouseFilled UsersFilled ServerFilled BoltFilled WalletFilled PaintbrushFilled` |

## 图标规则

- 只经 `Icons` 出口使用，出口名是语义名，内部映射到具体图标库；只导出用到的图标。
- 默认 `aria-hidden`、`.ui-icon`、14px；Nucleo 的 `stroke-width="2"` 由 `.ui-icon [stroke-width='2'] { stroke-width: var(--icon-stroke-width) }` 统一调细。
- 设置导航图标一律实心；顶部「返回」用 `ChevronLeft`。
- 小型自绘图标（搜索框放大镜、加载、提示）用 24 网格，线宽走 `--icon-stroke-width-medium/bold`。

## 准入规则

1. **新增组件须经产品负责人确认**。申请时说明：为什么已有组件组合不了、底座用哪个 Base UI 组件、规格（尺寸 / 状态）。
2. 页面版式（设置页卡片、行、列表等）由已有组件组合，放在应用侧（如 `settings-parts.tsx`），不进入组件库。
3. 新组件必须：基于 Base UI（没有对应时说明缺口）、样式只用变量、补组件层变量、类名遵循 `ui-*`、导出在 `index.ts`。
4. 组件库是纯展示层：不依赖 Electron / Node / 服务端，ESLint 约束；可以被桌面 Renderer 与登录网页共同使用。

## 交互细节（组件内已实现，勿破坏）

- 悬停立即出现、移开 150ms 淡出（`.ui-button:hover { transition-duration: 0 }`）。
- 菜单展开原点跟随触发器（`--transform-origin`），进场 `scale(0.96)` + 按方向 ±4px 位移。
- 键盘：Tab 顺序、Esc 关闭、方向键切换 Tabs / Menu 由 Base UI 保留（虽然不显示焦点环）。
- 禁用中但 loading 的按钮仍可聚焦（`focusableWhenDisabled`），`aria-busy`。
