# saas-desktop-ui-framework

一套可复用的 SaaS 桌面端界面框架（Electron + React + Base UI），提炼自 Diotia 桌面端。让 agent 在新应用里复刻同一套视觉、窗口结构、组件与规则。

入口：[SKILL.md](SKILL.md)

## 目录

```
SKILL.md                     # 触发条件、工作流程、硬规则、视觉速记
references/
  01-design-language.md      # 字体、颜色、线与阴影、尺寸表、动效
  02-design-tokens.md        # 三层设计变量
  03-window-shell.md         # 无标题栏窗口、侧栏、内容面板、标签栏、原生菜单、深浅模式
  04-components.md           # 组件清单与准入规则
  05-patterns.md             # 侧栏信息架构、空状态输入框、命令面板、右侧属性栏、设置页、主题编辑器
  06-guardrails.md           # ESLint、tokens 约束测试、E2E 几何断言、交付清单
assets/
  ui-kit/                    # 组件库完整源码（复制为 packages/ui）
  desktop-shell/main/        # Electron 主窗口、窗口状态、原生菜单、外观（参考实现）
  desktop-shell/renderer/    # 窗口框架、标签栏、侧栏、命令面板、设置页部件、外壳 CSS（参考实现）
  theme/                     # 自定义主题模型（OKLCH 推导）与运行时应用
  guardrails/                # 原生组件禁用 ESLint 片段、tokens 约束测试
```

## 复用时需要改的地方

- **包名**：资产源码里的 `@diotia/ui`、`@diotia/contracts`、`window.diotia` 改为新应用的名字。
- **图标**：`ui-kit/src/icons.tsx` 映射到付费的 `nucleo-micro-bold`；没有授权就换成其他图标库，保留出口名。
- **路径**：`guardrails/tokens.test.ts` 的 `FILES`、`roots` 与 `window.ts` 路径。
- **tsconfig**：`ui-kit/tsconfig.json` 的 `extends`。
- **desktop-shell/renderer/** 依赖原项目的 `nav`（路由 / 标签页）、`queries`（数据）与业务对象（Agent），是参考实现而不是即插即用；`tabs.ts`、`PanelHeader.tsx`、`shell.css` 基本可直接用。
- 源码注释里的 `ADR 00xx` 指原项目的决策记录，规格已在 `references/` 中整理。

## 来源

agent-playground 仓库：`packages/ui`、`apps/desktop`，ADR 0006（Base UI 组件库）、0007（窗口结构）、0008（三层变量）、0009（图标）、0010（Linear 视觉语言）、0011（标签栏）、0018 附录（设置页版式）、0019（主题）。快照日期 2026-10-12。
