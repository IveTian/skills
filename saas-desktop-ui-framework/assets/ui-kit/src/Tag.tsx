import type { ReactNode } from 'react';
import { cx } from './cx';

export type TagTone = 'neutral' | 'success' | 'attention' | 'accent' | 'outline' | 'muted';

/** 状态标签（经批准的轻量封装：Base UI 无对应组件）。 */
export function Tag({
  tone = 'neutral',
  dot,
  children,
  className,
}: {
  tone?: TagTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx('ui-tag', `ui-tag--${tone}`, className)}>
      {dot && <span className="ui-tag__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** 未读数量徽标（Tag 的计数形态）。 */
export function CountTag({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span className="ui-count" aria-label={label}>
      {count}
    </span>
  );
}
