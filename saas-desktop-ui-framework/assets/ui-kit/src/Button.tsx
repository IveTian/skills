import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'quiet'
  | 'danger'
  | 'danger-solid'
  | 'card'
  | 'item'
  | 'icon'
  | 'chip'
  | 'send'
  | 'sidebar';

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  /** 进行中：显示转圈并禁用，同时保留可读文本。 */
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Base UI Button 的风格化封装（主按钮 / 次要 / 文字 / 安静 / 危险 / 卡片 / 列表项 / 图标 / 标签 / 发送）。 */
export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      {...rest}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      className={cx(
        'ui-button',
        `ui-button--${variant}`,
        size !== 'md' && `ui-button--${size}`,
        className,
      )}
    >
      {loading && (
        <svg
          className="ui-spinner"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.2-8.56" />
        </svg>
      )}
      {children}
    </BaseButton>
  );
}
