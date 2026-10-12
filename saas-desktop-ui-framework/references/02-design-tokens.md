# 02 · 三层设计变量

源文件：`assets/ui-kit/src/tokens/{primitives,semantic,components}.css`，由 `styles.css` 按顺序导入。约束测试：`assets/guardrails/tokens.test.ts`。

## 为什么分三层

一层变量（名字是用途、值直接写色值）的问题：同一个灰在多个用途变量里各写一遍；组件里散落几百处 px / 字号 / 时长；新代码很容易继续写字面量。三层之后，改某个灰、某级字号、某档间距只需改一处；组件层可以单独微调某个组件；设计稿与代码用同一套语义名沟通。

## 结构

| 层 | 文件 | 内容 | 允许引用 |
| --- | --- | --- | --- |
| 基础 Primitive | `primitives.css` | 值本身：色板（中性灰、强调色、绿 / 橙 / 红、透明度色、可视化色）、像素刻度 `--size-*`、字号 / 行高 / 字重刻度、时长、缓动、缩放、透明度、层级 | **只写字面量**（唯一允许字面量的一层） |
| 语义 Semantic | `semantic.css` | 用途：表面、文字、边框、强调与状态、半透明叠加、阴影、字体角色、间距、圆角、线宽、图标尺寸、动效、层级；**深色模式只在这里重新赋值** | 只引用基础层 |
| 组件 Component | `components.css`；应用样式文件开头的 `:root` | 某组件专用的高度、内边距、圆角、专属颜色，窗口外壳 `--chrome*` / `--canvas*` | 语义层或基础层；可写组件独有的布局几何（px 宽度等）；不写颜色 / 时长 / 缓动 / 字重字面量；不感知明暗 |

## 命名约定

- 基础层：`--color-<色相>-<阶>`（数字越大越深，如 `--color-gray-50…975`）、`--color-black-a6`（透明度）、`--size-<px>`（`--size-0-5`、`--size-neg-4`）、`--font-size-<px>`、`--duration-<ms>`、`--easing-out-expo`。
- 语义层：
  - 表面 `--ground --surface --surface-raised --sunken --surface-window --surface-canvas --surface-inverse --overlay --hover`
  - 叠加 `--fill-translucent-{hover,selected,active} --border-translucent`
  - 文字 `--ink --ink-2 --ink-3 --ink-inverse --ink-window-2/3`
  - 强调 / 状态 `--accent(-hover/-soft/-ink) --on-accent --success(-soft) --attention(-soft/-ink/-wash) --danger(-border/-wash/-ink) --on-danger --disabled-bg/-ink`
  - 阴影 `--shadow-{raised,soft,popup,dialog,spotlight}`
  - 字体 `--font-family-{sans,mono} --font-size-{2xs…4xl,display} --line-height-{none,xs…3xl,display} --font-weight-{regular,medium,semibold,bold} --letter-spacing-{tight,display}`
  - 间距 `--space-{3xs…5xl}`；圆角 `--radius-{xs…3xl,pill,circle}`
  - 线与图标 `--border-width --icon-size-{2xs…lg} --icon-stroke-width(-thin/-medium/-bold)`
  - 动效 `--duration-{instant,fast,base,slow,layout,spin} --easing-emphasized --scale-pop(-subtle)`
  - 其他 `--opacity-{disabled,secondary} --z-index-{window-controls,dragging,toast}`
- 组件层：`--<组件>-<属性>`，如 `--button-height-sm`、`--menu-item-radius`、`--sidebar-item-indent-child`、`--side-card-padding-x`。应用侧外壳变量（`--titlebar-h`、`--panel-gap`、`--sidebar-width`、`--settings-*`）写在应用 `styles.css` 开头的 `:root`。

## 规则

1. **组件样式**（普通 CSS 声明）只引用语义层与组件层；不写颜色、非 0 长度、时长、`cubic-bezier`、字号 / 字重 / 行高数值、非 0/1 的透明度与缩放；不直接引用基础层。
2. **组件代码**（`.tsx`）不写颜色、SVG 尺寸 / 线宽、带数值的内联样式，交给样式类。运行时才知道的值（标签页数量、拖动宽度、颜色选择器坐标）用内联 CSS 自定义属性，并登记到 `tokens.test.ts` 的 `RUNTIME_VARS`。
3. **所有 `var()` 都必须有定义**（Base UI 运行时变量 `--transform-origin`、`--collapsible-panel-height` 除外）。
4. **基础层不留闲置值**：没被任何地方引用的基础值要删掉。
5. **主进程窗口底色**与 `--chrome`（浅 / 深）一致，由测试比对。

## 新增取值的决策流程

```
需要一个值
 ├─ 语义层已有这个用途？ → 直接用
 ├─ 是通用用途（多个组件会用）？ → 加语义变量（必要时先加基础值），并在深色块里赋值
 └─ 只属于某个组件？ → 加组件变量，引用语义层 / 基础层刻度
基础层没有这个值 → 才在基础层加字面量
```

## 换品牌 / 换主题

- **换强调色**：在基础层加新色板（如 `--color-brand-50…900`），改语义层 `--accent* --on-accent` 的引用（浅、深两处）。
- **换中性灰**：改基础层灰阶的值即可；所有表面、文字、边框自动跟随。
- **运行时自定义主题**：在 `<html>` 上以内联样式覆盖语义 / 组件层变量（`data-theme="custom"`），不改样式表，三层约束不变。见 [05-patterns.md#主题编辑器](05-patterns.md#主题编辑器) 与 `assets/theme/`。

## 重构到三层时的验证方法

把所有样式文件里每条声明的 `var()` 展开为最终值（浅色、深色各一遍），重构前后逐条比对，必须完全一致——这样能证明「视觉零变化」，而不需要截图。
