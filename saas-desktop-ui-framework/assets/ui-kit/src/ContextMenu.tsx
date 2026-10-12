import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';

/** Base UI ContextMenu：右键菜单（侧栏 Agent 行等）。 */
export const ContextMenu = BaseContextMenu.Root;

export function ContextMenuTrigger({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseContextMenu.Trigger>, 'className'> & { className?: string }) {
  return <BaseContextMenu.Trigger {...rest} className={className} />;
}

export function ContextMenuContent({ children }: { children: ReactNode }) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner>
        <BaseContextMenu.Popup className="ui-menu">{children}</BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

export function ContextMenuItem({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseContextMenu.Item>, 'className'> & { className?: string }) {
  return <BaseContextMenu.Item {...rest} className={cx('ui-menu__item', className)} />;
}

export function ContextMenuSeparator() {
  return <BaseContextMenu.Separator className="ui-menu__separator" />;
}
