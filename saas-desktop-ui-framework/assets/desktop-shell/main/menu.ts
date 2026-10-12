import type { MenuCommand } from '@diotia/contracts';
import { Menu, type MenuItemConstructorOptions } from 'electron';

/**
 * 原生菜单栏（桌面习惯）：快捷键由菜单 accelerator 提供，命令经白名单 IPC 发给 Renderer。
 * 编辑菜单使用系统角色，保证输入框里的复制、粘贴、撤销等行为与系统一致。
 */
export function installAppMenu(send: (command: MenuCommand) => void, isDev: boolean) {
  const isMac = process.platform === 'darwin';
  const cmd = (
    label: string,
    command: MenuCommand,
    accelerator?: string,
  ): MenuItemConstructorOptions => ({
    label,
    accelerator,
    click: () => send(command),
  });
  /** 不显示在菜单里、只提供快捷键的项（Chrome 的 ⌘1–⌘9、⌘⌥→ 等同样不在菜单中列出）。 */
  const hidden = (command: MenuCommand, accelerator: string): MenuItemConstructorOptions => ({
    ...cmd(command, command, accelerator),
    visible: false,
    acceleratorWorksWhenHidden: true,
  });
  const tabNumbers = (
    ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5', 'tab-6', 'tab-7', 'tab-8'] as const
  ).map((command, i) => hidden(command, `CmdOrCtrl+${i + 1}`));

  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    {
      label: '文件',
      submenu: [
        cmd('新建标签页', 'new-tab', 'CmdOrCtrl+T'),
        cmd('新建 Agent', 'new-agent', 'CmdOrCtrl+N'),
        cmd('新建会话', 'new-conversation', 'CmdOrCtrl+Shift+N'),
        { type: 'separator' },
        cmd('重新打开关闭的标签页', 'reopen-tab', 'CmdOrCtrl+Shift+T'),
        cmd('关闭标签页', 'close-tab', 'CmdOrCtrl+W'),
        { role: 'close', label: '关闭窗口', accelerator: 'CmdOrCtrl+Shift+W' },
        ...(isMac
          ? []
          : [{ type: 'separator' as const }, { role: 'quit' as const, label: '退出' }]),
      ],
    },
    { role: 'editMenu', label: '编辑' },
    {
      label: '显示',
      submenu: [
        cmd('切换侧栏', 'toggle-sidebar', 'CmdOrCtrl+\\'),
        cmd('切换 Agent 档案', 'toggle-dossier', 'CmdOrCtrl+Shift+\\'),
        { type: 'separator' },
        { role: 'togglefullscreen', label: '进入全屏' },
        ...(isDev
          ? ([
              { type: 'separator' },
              { role: 'reload' },
              { role: 'toggleDevTools' },
            ] as MenuItemConstructorOptions[])
          : []),
      ],
    },
    {
      label: '前往',
      submenu: [
        cmd('搜索…', 'search', 'CmdOrCtrl+K'),
        cmd('活动', 'activity', 'CmdOrCtrl+Shift+A'),
        { type: 'separator' },
        cmd('后退', 'back', 'CmdOrCtrl+['),
        cmd('前进', 'forward', 'CmdOrCtrl+]'),
      ],
    },
    {
      label: '标签页',
      submenu: [
        cmd('选择下一个标签页', 'next-tab', 'Ctrl+Tab'),
        cmd('选择上一个标签页', 'prev-tab', 'Ctrl+Shift+Tab'),
        { type: 'separator' },
        cmd('复制标签页', 'duplicate-tab'),
        hidden('next-tab', 'CmdOrCtrl+Alt+Right'),
        hidden('prev-tab', 'CmdOrCtrl+Alt+Left'),
        hidden('next-tab', 'CmdOrCtrl+Shift+]'),
        hidden('prev-tab', 'CmdOrCtrl+Shift+['),
        ...tabNumbers,
        hidden('tab-last', 'CmdOrCtrl+9'),
      ],
    },
    { role: 'windowMenu', label: '窗口' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
