import { Collapsible } from '@base-ui/react/collapsible';
import type { ReactNode } from 'react';
import { CaretDown } from './icons';

/**
 * 侧栏卡片（Linear 右侧栏样式）：浮在内容面板上的白色卡片，标题（h3）可折叠，右侧可放一个操作按钮。
 * 内容通常是若干 PropertyRow，也可以是说明文字或按钮。
 */
export function SideCard({
  title,
  action,
  defaultOpen = true,
  children,
}: {
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} className="ui-side-card">
      <div className="ui-side-card__head">
        <h3 className="ui-side-card__heading">
          <Collapsible.Trigger className="ui-side-card__toggle">
            {title}
            <CaretDown />
          </Collapsible.Trigger>
        </h3>
        {action}
      </div>
      <Collapsible.Panel className="ui-collapsible__panel ui-side-card__panel">
        <div className="ui-side-card__body">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

/** 属性行：左侧固定宽度的标签（次要色），右侧为值。 */
export function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ui-property-row">
      <span className="ui-property-row__label">{label}</span>
      <span className="ui-property-row__value">{children}</span>
    </div>
  );
}
