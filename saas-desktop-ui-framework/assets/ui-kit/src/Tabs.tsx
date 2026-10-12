import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { cx } from './cx';

type Cls = { className?: string };

/** Base UI Tabs 的风格化部件。竖排用于 Workspace 模块导航。 */
export function Tabs({
  className,
  orientation = 'horizontal',
  ...rest
}: Omit<ComponentProps<typeof BaseTabs.Root>, 'className'> & Cls) {
  return (
    <BaseTabs.Root
      {...rest}
      orientation={orientation}
      className={cx('ui-tabs', `ui-tabs--${orientation}`, className)}
    />
  );
}
export function TabList({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseTabs.List>, 'className'> & Cls) {
  return <BaseTabs.List {...rest} className={cx('ui-tabs__list', className)} />;
}
export function Tab({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseTabs.Tab>, 'className'> & Cls) {
  return <BaseTabs.Tab {...rest} className={cx('ui-tab', className)} />;
}
export function TabPanel({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseTabs.Panel>, 'className'> & Cls) {
  return <BaseTabs.Panel {...rest} className={cx('ui-tabs__panel', className)} />;
}
