import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import type { ReactNode } from 'react';
import { cx } from './cx';

export type TextFieldProps = {
  label: string;
  /** 视觉上隐藏标签（仍对读屏可见）。 */
  hideLabel?: boolean;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 多行输入：Field.Control 以 render 渲染为 textarea（Base UI 官方替换元素方式）。 */
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  disabled?: boolean;
  description?: ReactNode;
  /** 客户端校验：返回中文错误信息或 null。由 Base UI Field 在提交/修改时调用。 */
  validate?: (value: string) => string | null;
  /** 服务端返回的错误：强制标记为无效并显示。 */
  error?: string | null;
  /** 搜索样式：左侧放大镜图标。 */
  search?: boolean;
  className?: string;
};

/** Base UI Field + Label + Control/Input + Description + Error 的组合封装。 */
export function TextField(props: TextFieldProps) {
  const controlProps = {
    className: 'ui-field__control',
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange ? (v: string) => props.onValueChange!(v) : undefined,
    placeholder: props.placeholder,
    autoComplete: props.autoComplete,
    autoFocus: props.autoFocus,
    maxLength: props.maxLength,
  };
  const control = props.multiline ? (
    <Field.Control {...controlProps} render={<textarea rows={props.rows ?? 3} />} />
  ) : (
    <Input {...controlProps} type={props.type ?? 'text'} />
  );

  return (
    <Field.Root
      name={props.name}
      disabled={props.disabled}
      invalid={props.error ? true : undefined}
      validate={props.validate ? (v) => props.validate!(typeof v === 'string' ? v : '') : undefined}
      className={cx('ui-field', props.search && 'ui-field--search', props.className)}
    >
      <Field.Label className={cx('ui-field__label', props.hideLabel && 'ui-sr-only')}>
        {props.label}
      </Field.Label>
      {props.search ? (
        <div className="ui-field__wrap">
          <svg
            className="ui-field__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          {control}
        </div>
      ) : (
        control
      )}
      {props.description && (
        <Field.Description className="ui-field__description">{props.description}</Field.Description>
      )}
      {props.error ? (
        <Field.Error className="ui-field__error" match>
          {props.error}
        </Field.Error>
      ) : (
        <Field.Error className="ui-field__error" />
      )}
    </Field.Root>
  );
}
