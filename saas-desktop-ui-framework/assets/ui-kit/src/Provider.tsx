import { Toast } from '@base-ui/react/toast';
import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import { ToastViewport } from './Toast';

/** 应用根部的 UI 上下文：Tooltip 延迟统一、Toast 队列与视口。 */
export function UIProvider({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delay={400}>
      <Toast.Provider timeout={4000} limit={3}>
        {children}
        <ToastViewport />
      </Toast.Provider>
    </Tooltip.Provider>
  );
}
