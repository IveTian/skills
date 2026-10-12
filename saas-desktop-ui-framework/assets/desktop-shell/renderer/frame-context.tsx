import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

/** 窗口级界面状态：侧栏、Agent 档案、命令面板。侧栏与档案的开合记在本机（便利项，读写失败不影响使用）。 */
type Frame = {
  isMac: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  dossierOpen: boolean;
  toggleDossier: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};
const FrameContext = createContext<Frame | null>(null);

function usePersistentFlag(key: string, initial: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : raw === '1';
    } catch {
      return initial;
    }
  });
  const toggle = useCallback(() => {
    setValue((v) => {
      try {
        localStorage.setItem(key, v ? '0' : '1');
      } catch {
        // 本机存储不可用时只在本次运行中生效
      }
      return !v;
    });
  }, [key]);
  return [value, toggle] as const;
}

export function FrameProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, toggleSidebar] = usePersistentFlag('diotia.sidebarOpen', true);
  const [dossierOpen, toggleDossier] = usePersistentFlag('diotia.dossierOpen', true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isMac = window.diotia.app.platform === 'darwin';
  return (
    <FrameContext.Provider
      value={{
        isMac,
        sidebarOpen,
        toggleSidebar,
        dossierOpen,
        toggleDossier,
        paletteOpen,
        setPaletteOpen,
      }}
    >
      {children}
    </FrameContext.Provider>
  );
}

export function useFrame(): Frame {
  const f = useContext(FrameContext);
  if (!f) throw new Error('FrameProvider missing');
  return f;
}
