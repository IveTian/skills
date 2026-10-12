import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';

/** Base UI Collapsible 封装：标题按钮 + 可展开内容。 */
export const Collapsible = BaseCollapsible.Root;

export function CollapsibleTrigger({ children }: { children: ReactNode }) {
  return (
    <BaseCollapsible.Trigger className="ui-button ui-button--ghost ui-collapsible__trigger">
      <svg
        className="ui-chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      {children}
    </BaseCollapsible.Trigger>
  );
}

export function CollapsiblePanel({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseCollapsible.Panel>, 'className'> & { className?: string }) {
  return <BaseCollapsible.Panel {...rest} className={cx('ui-collapsible__panel', className)} />;
}
