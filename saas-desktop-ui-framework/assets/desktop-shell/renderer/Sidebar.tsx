import type { Agent, DesktopUser } from '@diotia/contracts';
import {
  Avatar,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  CountTag,
  Icons,
  IconButton,
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuTrigger,
  ScrollArea,
  SidebarItem,
  SidebarSection,
  SidebarTreeItem,
  StatusDot,
  relativeTime,
  useToast,
} from '@diotia/ui';
import { errorMessage } from '../format';
import { useEffect, useState } from 'react';
import { agentRoute, useLink, useNav, useTabs } from '../nav';
import {
  useArchivedAgents,
  useCan,
  useConversations,
  useHome,
  useMe,
  useWorkspaces,
} from '../queries';
import { useAgentActions } from './agent-actions';
import { useFrame } from './frame-context';
import type { OpenSettings } from './AppFrame';
import { roleLabel, useWorkspaceAction } from './workspace';

/**
 * 侧栏（Cursor / Linear / ChatGPT 的共同结构 + 按状态分组）：
 * 顶部 Workspace 选择器 → 主动作（新建 / 搜索 / 活动）→ 需要处理 → Agents（当前 Workspace 共享，可展开自己的会话）→ 已归档；
 * 账户与 Workspace 设置在独立的设置页面（顶部 Workspace 菜单 →「设置」），侧栏底部不再有账户区。
 * 「运行中 · 已排程」分组在 Runtime 与定时任务上线后出现（P0.2 / P0.4），当前没有数据来源时不显示。
 */
export function Sidebar({
  user,
  onOpenSettings,
  onCreateWorkspace,
  onSignOut,
}: {
  user: DesktopUser;
  onOpenSettings: OpenSettings;
  onCreateWorkspace: () => void;
  onSignOut: () => void;
}) {
  const { route, navigate } = useNav();
  const link = useLink();
  const { setPaletteOpen } = useFrame();
  const home = useHome();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const currentAgentId = route.name === 'agent' ? route.agentId : null;
  useEffect(() => {
    if (currentAgentId)
      setExpanded((s) => (s.has(currentAgentId) ? s : new Set(s).add(currentAgentId)));
  }, [currentAgentId]);

  const agents = home.data?.agents ?? [];
  const attention = agents.filter((a) => a.needsAttention);
  const setOpen = (id: string, open: boolean) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <aside className="sidebar" aria-label="侧栏">
      <WorkspaceMenu
        user={user}
        onOpenSettings={onOpenSettings}
        onCreateWorkspace={onCreateWorkspace}
        onSignOut={onSignOut}
      />
      <nav aria-label="主导航" className="sidebar-primary">
        <SidebarItem
          tone="primary"
          icon={<Icons.SquarePen />}
          label="新建"
          shortcut="⌘N"
          current={route.name === 'new'}
          {...link({ name: 'new' })}
        />
        <SidebarItem
          tone="primary"
          icon={<Icons.Search />}
          label="搜索"
          shortcut="⌘K"
          onClick={() => setPaletteOpen(true)}
        />
        <SidebarItem
          tone="primary"
          icon={<Icons.Inbox />}
          label="活动"
          current={route.name === 'activity'}
          trailing={
            <CountTag
              count={home.data?.unreadActivityCount ?? 0}
              label={`${home.data?.unreadActivityCount ?? 0} 条未读`}
            />
          }
          {...link({ name: 'activity' })}
        />
      </nav>

      <ScrollArea className="sidebar-scroll">
        {home.isError && (
          <div className="sidebar-note">
            <SidebarItem
              tone="muted"
              label="Agents 加载失败，点此重试"
              onClick={() => home.refetch()}
            />
          </div>
        )}
        {attention.length > 0 && (
          <SidebarSection title="需要处理">
            {attention.map((a) => (
              <AgentContextMenu key={a.id} agent={a}>
                <SidebarItem
                  icon={<StatusDot tone="attention" />}
                  label={a.name}
                  trailing={relativeTime(a.lastActivityAt)}
                  current={
                    currentAgentId === a.id && !(route.name === 'agent' && route.conversationId)
                  }
                  {...link(agentRoute(a.id))}
                />
              </AgentContextMenu>
            ))}
          </SidebarSection>
        )}

        <SidebarSection
          title="Agents"
          action={
            <IconButton
              label="新建 Agent"
              shortcut="⌘N"
              icon={<Icons.Plus />}
              onClick={() => navigate({ name: 'new' })}
              tooltipSide="right"
            />
          }
        >
          {home.isSuccess && agents.length === 0 && (
            <p className="sidebar-empty">还没有 Agent。点「新建」描述你的目标。</p>
          )}
          {agents.map((a) => (
            <AgentTree
              key={a.id}
              agent={a}
              open={expanded.has(a.id)}
              onOpenChange={(o) => setOpen(a.id, o)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="已归档" defaultOpen={false}>
          <ArchivedList />
        </SidebarSection>
      </ScrollArea>
    </aside>
  );
}

/**
 * 侧栏顶部的 Workspace 菜单（ADR 0017，位置与条目顺序对照 Linear）：
 * 设置、邀请和管理成员 | 切换 Workspace ▸（当前账户、我的 Workspace、收到的邀请、
 * 新建 Workspace）、退出登录。个人信息与 Workspace 设置都在独立的设置页面中。
 */
function WorkspaceMenu({
  user,
  onOpenSettings,
  onCreateWorkspace,
  onSignOut,
}: {
  user: DesktopUser;
  onOpenSettings: OpenSettings;
  onCreateWorkspace: () => void;
  onSignOut: () => void;
}) {
  const me = useMe();
  const overview = useWorkspaces();
  const act = useWorkspaceAction();
  const toast = useToast();
  const canManageMembers = useCan('member:update');
  const current = me.data?.workspace;
  const label = current?.name ?? 'Workspace';
  const switchTo = (workspaceId: string) => {
    if (workspaceId === current?.id) return;
    act.mutate(
      { type: 'setActive', workspaceId },
      { onError: (e) => toast.error('没有切换成功', errorMessage(e)) },
    );
  };
  const accept = (invitationId: string, name: string) =>
    act.mutate(
      { type: 'acceptInvitation', invitationId },
      {
        onSuccess: () => toast.success(`已加入「${name}」`),
        onError: (e) => toast.error('没有加入成功', errorMessage(e)),
      },
    );

  return (
    <div className="sidebar-top">
      <Menu>
        <MenuTrigger
          variant="row"
          className="sidebar-workspace"
          aria-label={`Workspace：${label}，切换或管理`}
        >
          <Avatar name={label} />
          <span className="sidebar-workspace__name">{label}</span>
          {/* 细线小箭头（对照 Linear）：10px、1.5px 描边 */}
          <svg
            className="sidebar-workspace__chevron"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 4 5 6.5 7.5 4" />
          </svg>
        </MenuTrigger>
        <MenuContent align="start" side="bottom">
          <MenuItem onClick={() => onOpenSettings('preferences')}>设置</MenuItem>
          {canManageMembers && (
            <MenuItem onClick={() => onOpenSettings('members', true)}>邀请和管理成员</MenuItem>
          )}
          <MenuSeparator />
          <MenuSubmenu>
            <MenuSubmenuTrigger>切换 Workspace</MenuSubmenuTrigger>
            <MenuContent side="right" align="start">
              <MenuHeader>{user.email}</MenuHeader>
              {overview.data && current && (
                <MenuRadioGroup value={current.id} onValueChange={switchTo}>
                  {overview.data.workspaces.map((w) => (
                    <MenuRadioItem
                      closeOnClick
                      key={w.id}
                      value={w.id}
                      meta={w.id === current.id ? roleLabel(current.role) : undefined}
                    >
                      {w.name}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              )}
              {overview.data?.invitations.map((i) => (
                <MenuItem key={i.id} onClick={() => accept(i.id, i.workspaceName)}>
                  加入「{i.workspaceName}」（{roleLabel(i.role)}）
                </MenuItem>
              ))}
              <MenuSeparator />
              <MenuItem onClick={onCreateWorkspace}>新建 Workspace…</MenuItem>
            </MenuContent>
          </MenuSubmenu>
          <MenuItem onClick={onSignOut}>退出登录</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}

function AgentTree({
  agent,
  open,
  onOpenChange,
}: {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { route, open: openRoute } = useNav();
  const isCurrent = route.name === 'agent' && route.agentId === agent.id;
  const trailing = agent.needsAttention ? (
    <StatusDot tone="attention" label="需要处理" />
  ) : agent.status === 'draft' ? (
    '草稿'
  ) : (
    relativeTime(agent.lastActivityAt)
  );
  return (
    <AgentContextMenu agent={agent}>
      <SidebarTreeItem
        label={agent.name}
        trailing={trailing}
        current={isCurrent && !route.conversationId}
        open={open}
        onOpenChange={onOpenChange}
        onSelect={(e) => openRoute(agentRoute(agent.id), e)}
        expandLabel={`${open ? '收起' : '展开'}「${agent.name}」的会话`}
        muted={agent.status === 'archived'}
      >
        {open && <AgentConversations agent={agent} />}
      </SidebarTreeItem>
    </AgentContextMenu>
  );
}

function AgentConversations({ agent }: { agent: Agent }) {
  const { route } = useNav();
  const link = useLink();
  const list = useConversations(agent.id);
  if (list.isPending) return <SidebarItem tone="child" label="加载中…" disabled />;
  if (list.isError)
    return <SidebarItem tone="child" label="加载失败，点此重试" onClick={() => list.refetch()} />;
  const items = list.data.pages.flatMap((p) => p.items);
  if (items.length === 0) return <SidebarItem tone="child" label="还没有会话" disabled />;
  return (
    <>
      {items.map((c) => (
        <SidebarItem
          key={c.id}
          tone="child"
          label={c.title}
          trailing={relativeTime(c.updatedAt)}
          current={route.name === 'agent' && route.conversationId === c.id}
          {...link(agentRoute(agent.id, c.id))}
        />
      ))}
      {list.hasNextPage && (
        <SidebarItem
          tone="child"
          label={list.isFetchingNextPage ? '加载中…' : '更多…'}
          onClick={() => list.fetchNextPage()}
        />
      )}
    </>
  );
}

function ArchivedList() {
  const archived = useArchivedAgents(true);
  const { route } = useNav();
  const link = useLink();
  if (archived.isPending) return <SidebarItem tone="child" label="加载中…" disabled />;
  if (archived.isError)
    return (
      <SidebarItem tone="child" label="加载失败，点此重试" onClick={() => archived.refetch()} />
    );
  if (archived.data.items.length === 0)
    return <p className="sidebar-empty">没有已归档的 Agent。</p>;
  return (
    <>
      {archived.data.items.map((a) => (
        <AgentContextMenu key={a.id} agent={a}>
          <SidebarItem
            tone="muted"
            icon={<Icons.Archive />}
            label={a.name}
            current={route.name === 'agent' && route.agentId === a.id}
            {...link(agentRoute(a.id))}
          />
        </AgentContextMenu>
      ))}
    </>
  );
}

/** 侧栏 Agent 行的右键菜单（Base UI ContextMenu）。 */
function AgentContextMenu({ agent, children }: { agent: Agent; children: React.ReactNode }) {
  const { navigate } = useNav();
  const tabs = useTabs();
  const actions = useAgentActions();
  const canDelete = useCan('agent:delete');
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate(agentRoute(agent.id))}>打开</ContextMenuItem>
        <ContextMenuItem
          onClick={() =>
            tabs.dispatch({ type: 'open', route: agentRoute(agent.id), background: true })
          }
        >
          在新标签页中打开
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => actions.newConversation(agent)}
          disabled={agent.status === 'archived'}
        >
          新建会话
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(agentRoute(agent.id, undefined, 'tune'))}>
          调整
        </ContextMenuItem>
        <ContextMenuSeparator />
        {agent.status === 'archived' ? (
          <ContextMenuItem onClick={() => actions.requestRestore(agent)}>取消归档</ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={() => actions.requestArchive(agent)}>归档</ContextMenuItem>
        )}
        {canDelete && (
          <ContextMenuItem
            onClick={() => actions.requestDelete(agent)}
            className="ui-menu__item--danger"
          >
            删除
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
