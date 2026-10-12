# 06 · 守护规则与验证

规范靠自动化执行，而不是靠记忆。第一天就接入下面三项。

## 1. ESLint：禁用浏览器原生组件

`assets/guardrails/native-ui-bans.eslint.js` 是 `no-restricted-syntax` 规则片段：

- 应用层（Renderer、登录网页）禁用：`button|input|textarea|select|option|optgroup|datalist|dialog|details|summary|form|progress|meter|fieldset|label`
- 组件库内部只禁用：`select|option|optgroup|datalist|dialog|details|summary|progress|meter`（Base UI 需要的基础元素放行）
- 任意小写原生元素上的 `title` 属性 → 用 Tooltip
- `alert / confirm / prompt` 与 `window.alert…` → 用 ConfirmDialog / Toast

接入：

```js
// eslint.config.js
{ files: ['apps/desktop/src/renderer/**/*.tsx', 'apps/web/src/**/*.tsx'],
  rules: { 'no-restricted-syntax': nativeUiBans(APP_NATIVE) } },
{ files: ['packages/ui/src/**/*.tsx'],
  rules: { 'no-restricted-syntax': nativeUiBans(UI_NATIVE) } },
```

同时用 `no-restricted-imports` 约束边界：组件库与 Renderer 不得导入 `electron`、Node 内置模块、服务端包；Renderer 不得导入认证客户端与 Main / Preload 实现。

接入后用故意违规的样例（原生 button / select / title / alert）确认确实报错。

## 2. 设计变量三层约束测试

`assets/guardrails/tokens.test.ts`（Vitest）。改 `FILES` 为新项目的路径（组件库三层变量 + `styles.css` + 每个应用的样式文件），检查：

- 基础层只有字面量；语义层只引用基础层；
- 组件层无颜色 / 时长 / 缓动字面量；
- 组件样式无设计字面量、不直接引用基础层；
- 所有 `var()` 都有定义（登记在 `RUNTIME_VARS` 的运行时变量与 Base UI 变量除外）；
- 基础层无闲置值；
- 组件代码（`.tsx`）无颜色与尺寸字面量；
- Main 窗口底色与 `--chrome`（浅 / 深）一致。

接入后注入一条违规样式确认能被拦截。

## 3. E2E 几何与状态断言（Playwright + Electron）

不截图也能证明布局正确——测量计算样式与元素坐标：

- **标题栏中线**：红绿灯覆盖区高、窗口按钮中心、标签页中心都在 22px；面板顶边在 44px。
- **侧栏开合**：逐帧采样宽度与标题栏留位，连续、单调、有中间帧；`prefers-reduced-motion` 下无中间帧；收起后侧栏 `visibility: hidden`、面板左间隙 8px；开合前后侧栏开关坐标不变。
- **侧栏填充**：读取侧栏与窗口按钮组内全部元素的计算背景色——空闲 / 悬停 / 选中 / 按下状态下均无不透明实色（状态点、计数、头像、标签除外），且各状态确实有半透明填充。
- **菜单规格**：圆角、内边距、选项高、文字左缘、高亮块缩进、分隔线等实测值。
- **交互**：Dialog、Field 校验（无原生气泡）、ConfirmDialog、Tabs、Menu / 子菜单、Toast、命令面板（点击与回车）、右键菜单、标签页（⌘ 点击后台打开、+、⌘1、⌃Tab、中键关闭、⌘⇧T、拖动排序、关闭其他）、窗口状态重启恢复。
- 测试窗口可 headless（不显示、不抢焦点），但要关掉 `backgroundThrottling`，否则动画帧暂停、采样失败。

## 交付检查清单

```
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build
```

- [ ] 没有原生控件 / `title` / `alert`（lint）
- [ ] 样式没有字面量，变量都有定义（tokens 测试）
- [ ] 新增变量放在了正确的层，深色模式只在语义层赋值
- [ ] 侧栏 / 标签栏状态只用半透明叠加色
- [ ] 没有新增组件；或新增组件已经产品负责人确认并记录决策
- [ ] 标题栏高度改动已同步 Main、CSS 与 E2E
- [ ] 依赖为精确版本
- [ ] 如实报告：哪些已实现、哪些测试通过、哪些需要人工确认

## 视觉确认交给人

开发者 / agent 不做截图或模拟器的视觉判断。交付时告诉产品负责人：

- 怎么打开（例如 `pnpm dev:desktop`，或安装包位置）；
- 该看哪里：红绿灯与窗口按钮是否同一中线、侧栏与面板配色、悬停 / 选中观感、窗口拖动、原生菜单与快捷键、深色模式、自定义主题的对比度；
- 哪些是本次改动影响的页面与状态。

## 记录决策

视觉或结构的取舍（例如去掉焦点环、实色窗口底、新增组件）写成 ADR：背景、决策、与规范的偏离、后果、验证方式。后续修订在原 ADR 里追加日期条目，并标注被哪个 ADR 取代。
