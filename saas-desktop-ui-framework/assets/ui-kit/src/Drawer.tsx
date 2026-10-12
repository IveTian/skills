import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ReactNode } from 'react';
import { Button } from './Button';

/** Base UI Drawer 封装：窄窗口下从右侧滑出的面板。 */
export function Drawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <BaseDrawer.Root
      open={props.open}
      onOpenChange={(o) => props.onOpenChange(o)}
      swipeDirection="right"
    >
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="ui-backdrop" />
        <BaseDrawer.Popup className="ui-drawer">
          <div className="ui-drawer__head">
            <BaseDrawer.Title className="ui-drawer__title">{props.title}</BaseDrawer.Title>
            <BaseDrawer.Close render={<Button variant="quiet" size="sm" />}>关闭</BaseDrawer.Close>
          </div>
          {props.children}
        </BaseDrawer.Popup>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
