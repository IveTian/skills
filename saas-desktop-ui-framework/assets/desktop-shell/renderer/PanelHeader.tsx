import { IconButton, Icons, SidebarIcon } from '@diotia/ui';
import type { ReactNode } from 'react';
import { useNav } from '../nav';
import { useFrame } from './frame-context';

/**
 * 窗口按钮组：侧栏开关 + 后退 / 前进。
 * 固定在标题栏（横向起点取自系统的 env(titlebar-area-x)，紧跟红绿灯），垂直中心与红绿灯同为标题栏中线。
 * 侧栏开关位置不变；后退 / 前进在侧栏展开时贴侧栏右缘，收起时回到开关右侧，随侧栏开合同步过渡。
 */
export function WindowControls() {
  const { toggleSidebar, sidebarOpen } = useFrame();
  const { back, forward, canBack, canForward } = useNav();
  return (
    <div
      className={`window-controls ui-drag ${sidebarOpen ? 'window-controls--sidebar' : ''}`}
      role="toolbar"
      aria-label="窗口"
    >
      <IconButton
        label={sidebarOpen ? '收起侧栏' : '展开侧栏'}
        shortcut="⌘\"
        icon={<SidebarIcon collapsed={!sidebarOpen} />}
        onClick={toggleSidebar}
      />
      <div className="window-controls__history">
        <IconButton
          label="后退"
          shortcut="⌘["
          icon={<Icons.ChevronLeft />}
          onClick={back}
          disabled={!canBack}
        />
        <IconButton
          label="前进"
          shortcut="⌘]"
          icon={<Icons.ChevronRight />}
          onClick={forward}
          disabled={!canForward}
        />
      </div>
    </div>
  );
}

/**
 * 内容面板顶栏：可拖动窗口，44px 高（Linear）。leading / center / trailing 三段布局。
 * 窗口按钮组与标签栏在面板上方的标题栏里，顶栏不再为它们留位。
 */
export function PanelHeader({
  leading,
  center,
  trailing,
  bordered,
}: {
  leading?: ReactNode;
  center?: ReactNode;
  trailing?: ReactNode;
  bordered?: boolean;
}) {
  return (
    <header className={`panel-header ui-drag ${bordered ? 'panel-header--bordered' : ''}`}>
      <div className="panel-header__leading">{leading}</div>
      <div className="panel-header__center">{center}</div>
      <div className="panel-header__trailing">{trailing}</div>
    </header>
  );
}
