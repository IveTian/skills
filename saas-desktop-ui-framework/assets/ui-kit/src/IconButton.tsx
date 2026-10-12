import type { ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { Tooltip } from './Tooltip';

/** 只有图标的工具栏按钮（Button 变体 + Tooltip）：label 同时作为无障碍名称与提示文字。 */
export function IconButton({
  label,
  shortcut,
  icon,
  pressed,
  tooltipSide = 'bottom',
  ...rest
}: Omit<ButtonProps, 'variant' | 'children' | 'aria-label'> & {
  label: string;
  shortcut?: string;
  icon: ReactNode;
  pressed?: boolean;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <Tooltip
      side={tooltipSide}
      content={
        shortcut ? (
          <>
            {label}
            <span className="ui-kbd ui-kbd--inline">{shortcut}</span>
          </>
        ) : (
          label
        )
      }
    >
      <Button {...rest} variant="icon" aria-label={label} aria-pressed={pressed}>
        {icon}
      </Button>
    </Tooltip>
  );
}
