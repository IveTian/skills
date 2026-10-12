import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * 设计变量三层约束（docs/adr/0008-design-tokens.md）：
 * - 基础层：唯一允许字面量的一层；
 * - 语义层：只引用基础层；
 * - 组件层：引用语义层或基础层，可写布局几何（px），不写颜色 / 时长 / 字重等字面量；
 * - 组件样式（规则里的普通声明）：只引用语义层与组件层，不写任何设计字面量。
 * 另外检查所有 var() 引用都有定义，基础层没有闲置值。
 */

const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

const FILES = {
  primitives: read('./tokens/primitives.css'),
  semantic: read('./tokens/semantic.css'),
  components: read('./tokens/components.css'),
  ui: read('./styles.css'),
  desktop: read('../../../apps/desktop/src/renderer/src/styles.css'),
  authWeb: read('../../../apps/auth-web/src/styles.css'),
};

/** 运行时注入的变量：Base UI 定位 / 折叠，以及标签栏的标签页数量与关闭后冻结的宽度（TabStrip 内联设置）。 */
const RUNTIME_VARS = new Set([
  '--transform-origin',
  '--collapsible-panel-height',
  '--tab-frozen-width',
  '--tab-count',
  // 用量图表的占比条（0–1，组件内联设置）。
  '--viz-share',
  // 颜色选择器：当前颜色、色相纯色与面板指针位置由组件内联设置
  '--color-picker-value',
  '--color-picker-hue-color',
  '--color-picker-x',
  '--color-picker-y',
]);

type Decl = { file: string; selector: string; prop: string; value: string; dark: boolean };

/** 极简 CSS 解析：去注释，按花括号递归，返回每条声明及其选择器。 */
function parse(file: string, css: string): Decl[] {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls: Decl[] = [];
  let i = 0;
  const walk = (selector: string, dark: boolean) => {
    let buf = '';
    while (i < src.length) {
      const ch = src[i++]!;
      if (ch === '{') {
        const next = buf.trim();
        walk(next, dark || /prefers-color-scheme:\s*dark/.test(next));
        buf = '';
      } else if (ch === '}') {
        flush(buf, selector, dark);
        return;
      } else if (ch === ';') {
        flush(buf, selector, dark);
        buf = '';
      } else buf += ch;
    }
    flush(buf, selector, dark);
  };
  const flush = (text: string, selector: string, dark: boolean) => {
    const t = text.trim();
    const colon = t.indexOf(':');
    if (!t || colon < 0 || t.startsWith('@')) return;
    decls.push({
      file,
      selector,
      dark,
      prop: t.slice(0, colon).trim(),
      value: t
        .slice(colon + 1)
        .replace(/\s+/g, ' ')
        .trim(),
    });
  };
  walk('', false);
  return decls;
}

const all = Object.entries(FILES).flatMap(([name, css]) => parse(name, css));
const defs = (file: keyof typeof FILES) =>
  new Set(all.filter((d) => d.file === file && d.prop.startsWith('--')).map((d) => d.prop));
const primitiveNames = defs('primitives');
const refs = (value: string) => [...value.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!);
const withoutVars = (value: string) => {
  // 去掉 var(...)（含嵌套括号）后剩下的字面部分
  let out = '';
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    if (depth === 0 && value.startsWith('var(', i)) {
      depth = 1;
      i += 3;
      continue;
    }
    if (depth > 0) {
      if (value[i] === '(') depth++;
      else if (value[i] === ')') depth--;
      continue;
    }
    out += value[i];
  }
  return out;
};

const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(/i;
/** 非零时长（0s / 0ms 是「无过渡」，不是设计取值）。 */
const DURATION_LITERAL = /(?<![\w.-])(\d*\.\d*[1-9]\d*|\d*[1-9]\d*)m?s\b/;
const DESIGN_LITERAL = new RegExp(
  [
    COLOR_LITERAL.source,
    String.raw`(?<![\w.-])-?(\d*\.)?\d*[1-9]\d*(\.\d+)?(px|em|rem)\b`, // 非零长度
    DURATION_LITERAL.source,
    String.raw`cubic-bezier\(`,
  ].join('|'),
  'i',
);
/** 必须用变量的属性：数值本身就是设计取值。 */
const TOKEN_ONLY_PROPS =
  /^(font-size|font-weight|line-height|letter-spacing|z-index|stroke-width)$/;

const report = (list: Decl[]) =>
  list.map((d) => `${d.file} ${d.selector} { ${d.prop}: ${d.value} }`);

describe('设计变量分层', () => {
  it('基础层只写字面量，不引用其他变量', () => {
    const bad = all.filter(
      (d) => d.file === 'primitives' && d.prop.startsWith('--') && d.value.includes('var('),
    );
    expect(report(bad)).toEqual([]);
  });

  it('语义层只引用基础层，不写字面量', () => {
    const bad = all.filter(
      (d) =>
        d.file === 'semantic' &&
        d.prop.startsWith('--') &&
        (refs(d.value).some((r) => !primitiveNames.has(r)) || /[^\s,0]/.test(withoutVars(d.value))),
    );
    expect(report(bad)).toEqual([]);
  });

  it('组件层不写颜色、时长、缓动等字面量', () => {
    const bad = all.filter(
      (d) =>
        d.file === 'components' &&
        d.prop.startsWith('--') &&
        (COLOR_LITERAL.test(d.value) ||
          DURATION_LITERAL.test(d.value) ||
          /cubic-bezier\(/.test(d.value)),
    );
    expect(report(bad)).toEqual([]);
  });

  it('组件样式不写设计字面量，也不直接引用基础层', () => {
    const styleFiles = new Set(['ui', 'desktop', 'authWeb']);
    const bad = all.filter((d) => {
      if (!styleFiles.has(d.file)) return false;
      // 应用样式开头的组件变量（:root / html[...] 中的自定义属性）按组件层规则检查
      if (d.prop.startsWith('--'))
        return COLOR_LITERAL.test(d.value) || DURATION_LITERAL.test(d.value);
      if (refs(d.value).some((r) => primitiveNames.has(r))) return true;
      const literal = withoutVars(d.value);
      if (DESIGN_LITERAL.test(literal)) return true;
      if (TOKEN_ONLY_PROPS.test(d.prop) && !/^var\(/.test(d.value)) return true;
      // 0 / 1 之外的透明度、缩放属于设计取值
      if (d.prop === 'opacity' && !/^(0|1|var\(.+\))$/.test(d.value)) return true;
      if (/scale\(\s*\d/.test(literal)) return true;
      return false;
    });
    expect(report(bad)).toEqual([]);
  });

  it('所有 var() 引用都有定义', () => {
    const defined = new Set(all.filter((d) => d.prop.startsWith('--')).map((d) => d.prop));
    const bad = all.flatMap((d) =>
      refs(d.value)
        .filter((r) => !defined.has(r) && !RUNTIME_VARS.has(r))
        .map((r) => `${d.file} ${d.selector} { ${d.prop} } → ${r}`),
    );
    expect(bad).toEqual([]);
  });

  it('基础层没有闲置值', () => {
    const used = new Set(all.filter((d) => d.file !== 'primitives').flatMap((d) => refs(d.value)));
    expect([...primitiveNames].filter((p) => !used.has(p))).toEqual([]);
  });

  it('组件代码不写颜色与尺寸字面量（交给样式与设计变量）', () => {
    const roots = ['.', '../../../apps/desktop/src/renderer/src', '../../../apps/auth-web/src'];
    const files = roots.flatMap((root) => {
      const dir = fileURLToPath(new URL(root, import.meta.url));
      return readdirSync(dir, { recursive: true, encoding: 'utf8' })
        .filter((f) => f.endsWith('.tsx'))
        .map((f) => ({ name: `${root}/${f}`, src: readFileSync(`${dir}/${f}`, 'utf8') }));
    });
    const bad = files.flatMap(({ name, src }) =>
      [
        /['"]#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?['"]/, // 颜色
        /\b(rgb|hsl)a?\(/, // 颜色
        /strokeWidth=/, // 线宽
        /<svg[^>]*\s(width|height)="\d/, // 图标尺寸
        /style=\{\{[^}]*\b\d+(px)?\b(?!%)/, // 内联样式里的数值（百分比除外）
      ]
        .filter((re) => re.test(src.replace(/\s+/g, ' ')))
        .map((re) => `${name} ${re}`),
    );
    expect(bad).toEqual([]);
  });

  it('主进程的窗口底色与 --chrome 一致（首帧前不闪色）', () => {
    const resolve = (name: string, dark: boolean): string => {
      const pick = (d: Decl) => d.prop === name && d.selector === ':root';
      const value =
        (dark && all.find((d) => pick(d) && d.dark)) || all.find((d) => pick(d) && !d.dark);
      if (!value) throw new Error(`未定义 ${name}`);
      return value.value.replace(/var\((--[\w-]+)\)/g, (_, ref: string) => resolve(ref, dark));
    };
    const windowTs = read('../../../apps/desktop/src/main/window.ts');
    const constant = (n: string) => windowTs.match(new RegExp(`${n} = '(#[0-9a-f]{6})'`))?.[1];
    expect(constant('CHROME_LIGHT')).toBe(resolve('--chrome', false));
    expect(constant('CHROME_DARK')).toBe(resolve('--chrome', true));
  });
});
