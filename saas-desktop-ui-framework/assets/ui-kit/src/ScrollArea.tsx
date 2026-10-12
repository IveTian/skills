import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ReactNode } from 'react';
import { cx } from './cx';

/** Base UI ScrollArea：细滚动条，悬停或滚动时显示。 */
export function ScrollArea({
  children,
  className,
  viewportClassName,
}: {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
}) {
  return (
    <BaseScrollArea.Root className={cx('ui-scroll', className)}>
      <BaseScrollArea.Viewport className={cx('ui-scroll__viewport', viewportClassName)}>
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar orientation="vertical" className="ui-scroll__bar">
        <BaseScrollArea.Thumb className="ui-scroll__thumb" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}
