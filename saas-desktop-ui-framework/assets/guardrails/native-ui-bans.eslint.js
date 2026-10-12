/**
 * 禁止浏览器原生组件（产品决定，见 docs/adr/0006）：界面一律使用 组件库（@<scope>/ui） 中基于 Base UI 的封装。
 * 包括原生表单控件、<dialog>/<details>、title 悬停提示与 alert/confirm/prompt。
 */
const nativeUiBans = (elements) => [
  'error',
  {
    selector: `JSXOpeningElement[name.name=/^(${elements})$/]`,
    message:
      '不允许直接使用浏览器原生组件，请使用 组件库（@<scope>/ui） 中的 Base UI 封装（新增组件需先经产品确认）。',
  },
  {
    selector: "JSXOpeningElement[name.name=/^[a-z]/] > JSXAttribute[name.name='title']",
    message: '不允许使用原生 title 悬停提示，请使用 组件库（@<scope>/ui） 的 Tooltip。',
  },
  {
    selector: 'CallExpression[callee.name=/^(alert|confirm|prompt)$/]',
    message: '不允许使用浏览器原生弹窗，请使用 ConfirmDialog / Toast。',
  },
  {
    selector: "MemberExpression[object.name='window'][property.name=/^(alert|confirm|prompt)$/]",
    message: '不允许使用浏览器原生弹窗，请使用 ConfirmDialog / Toast。',
  },
];
const APP_NATIVE =
  'button|input|textarea|select|option|optgroup|datalist|dialog|details|summary|form|progress|meter|fieldset|label';
const UI_NATIVE = 'select|option|optgroup|datalist|dialog|details|summary|progress|meter';


export { nativeUiBans, APP_NATIVE, UI_NATIVE };
