import type { DesktopUser } from '@diotia/contracts';
import { useEffect } from 'react';
import { TabNav, useNav, useTabs } from '../nav';
import { useAgent } from '../queries';
import { ActivityView } from '../views/ActivityView';
import { AgentView } from '../views/AgentView';
import { NewView } from '../views/NewView';
import { AgentActionsProvider, useAgentActions } from './agent-actions';
import { CommandMenu } from './CommandMenu';
import { useFrame } from './frame-context';
import { WindowControls } from './PanelHeader';
import { Sidebar } from './Sidebar';
import { TabStrip } from './TabStrip';
import type { SettingsSectionId } from '../settings/SettingsPage';
import { useSignOut } from './use-sign-out';

/**
 * 桌面窗口框架：标题栏（红绿灯、窗口按钮、标签栏）→ 侧栏（窗口底）+ 内容面板（圆角面板）。
 * 每个标签页的内容常驻在面板里，只显示当前标签页，切换时保留各自的滚动、输入等状态（与 Chrome 一致）。
 * 窗口最小宽度 900px，侧栏始终可用 ⌘\ 切换。
 */
export function AppFrame({
  user,
  hidden = false,
  onCreateWorkspace,
  onOpenSettings,
}: {
  user: DesktopUser;
  /** 新建 Workspace / 设置页面打开时隐藏（保持挂载，返回后标签页与页面状态不变）。 */
  hidden?: boolean;
  onCreateWorkspace: () => void;
  onOpenSettings: OpenSettings;
}) {
  return (
    <AgentActionsProvider>
      <FrameLayout
        user={user}
        hidden={hidden}
        onCreateWorkspace={onCreateWorkspace}
        onOpenSettings={onOpenSettings}
      />
    </AgentActionsProvider>
  );
}

export type OpenSettings = (section: SettingsSectionId, focusInvite?: boolean) => void;

function FrameLayout({
  user,
  hidden,
  onCreateWorkspace,
  onOpenSettings,
}: {
  user: DesktopUser;
  hidden: boolean;
  onCreateWorkspace: () => void;
  onOpenSettings: OpenSettings;
}) {
  const { route, navigate, back, forward } = useNav();
  const { tabs, activeId, dispatch: tabsDispatch, close: closeTab } = useTabs();
  const { sidebarOpen, toggleSidebar, toggleDossier, setPaletteOpen } = useFrame();
  const actions = useAgentActions();
  const currentAgent = useAgent(route.name === 'agent' ? route.agentId : '');

  const signOut = useSignOut();

  // 原生菜单栏 / 快捷键
  useEffect(
    () =>
      window.diotia.app.onMenuCommand((command) => {
        switch (command) {
          case 'new-agent':
            return navigate({ name: 'new' });
          case 'new-conversation':
            if (route.name === 'agent' && currentAgent.data)
              return actions.newConversation(currentAgent.data);
            return navigate({ name: 'new' });
          case 'search':
            return setPaletteOpen(true);
          case 'activity':
            return navigate({ name: 'activity' });
          case 'back':
            return back();
          case 'forward':
            return forward();
          case 'toggle-sidebar':
            return toggleSidebar();
          case 'toggle-dossier':
            return toggleDossier();
          case 'new-tab':
            return tabsDispatch({ type: 'new' });
          case 'close-tab':
            return closeTab(activeId);
          case 'reopen-tab':
            return tabsDispatch({ type: 'reopen' });
          case 'duplicate-tab':
            return tabsDispatch({ type: 'duplicate', id: activeId });
          case 'next-tab':
            return tabsDispatch({ type: 'cycle', delta: 1 });
          case 'prev-tab':
            return tabsDispatch({ type: 'cycle', delta: -1 });
          case 'tab-last':
            return tabsDispatch({ type: 'activateIndex', index: -1 });
          default:
            // tab-1 … tab-8
            return tabsDispatch({ type: 'activateIndex', index: Number(command.slice(4)) - 1 });
        }
      }),
    [
      route,
      currentAgent.data,
      actions,
      navigate,
      back,
      forward,
      toggleSidebar,
      toggleDossier,
      setPaletteOpen,
      tabsDispatch,
      closeTab,
      activeId,
    ],
  );

  return (
    <div className="frame" hidden={hidden}>
      <header className={`titlebar ui-drag ${sidebarOpen ? 'titlebar--sidebar' : ''}`}>
        <TabStrip />
      </header>
      <div className="frame-body">
        {/* 侧栏始终挂载：外层以 transitions-dev Card resize 在 238px ↔ 8px 之间过渡宽度，收起后内部隐藏 */}
        <div className={`sidebar-shell t-resize ${sidebarOpen ? '' : 'is-collapsed'}`}>
          <Sidebar
            user={user}
            onOpenSettings={onOpenSettings}
            onCreateWorkspace={onCreateWorkspace}
            onSignOut={() => signOut.mutate()}
          />
        </div>
        <main className="panel" aria-label="内容">
          {tabs.map((tab) => (
            <TabNav key={tab.id} tab={tab}>
              <div className="tab-page" role="tabpanel" hidden={tab.id !== activeId}>
                <RouteView />
              </div>
            </TabNav>
          ))}
        </main>
      </div>
      <WindowControls />
      <CommandMenu onOpenSessions={() => onOpenSettings('security')} />
    </div>
  );
}

/** 标签页内容：按该标签页当前路由渲染视图。 */
function RouteView() {
  const { route } = useNav();
  if (route.name === 'new') return <NewView />;
  if (route.name === 'activity') return <ActivityView />;
  return (
    <AgentView
      key={route.agentId}
      agentId={route.agentId}
      conversationId={route.conversationId}
      mode={route.mode}
    />
  );
}
