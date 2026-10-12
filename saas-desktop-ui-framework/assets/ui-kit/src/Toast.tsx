import { Toast } from '@base-ui/react/toast';
import { useMemo } from 'react';
import { CircleCheck, CircleX, X } from './icons';

/** Toast 视口：渲染当前所有提示（放在 UIProvider 中）。 */
function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => (
    <Toast.Root key={t.id} toast={t} className="ui-toast">
      {t.type === 'error' ? (
        <CircleX className="ui-toast__icon ui-toast__icon--error" />
      ) : (
        <CircleCheck className="ui-toast__icon ui-toast__icon--success" />
      )}
      <Toast.Content className="ui-toast__content">
        <Toast.Title className="ui-toast__title" />
        {t.description && <Toast.Description className="ui-toast__description" />}
      </Toast.Content>
      <Toast.Close className="ui-toast__close" aria-label="关闭提示">
        <X />
      </Toast.Close>
    </Toast.Root>
  ));
}

export function ToastViewport() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="ui-toast-viewport">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

/** 业务侧使用的提示接口：成功提示与错误提示。 */
export function useToast() {
  const manager = Toast.useToastManager();
  return useMemo(
    () => ({
      success: (title: string) => manager.add({ title, type: 'success' }),
      error: (title: string, description?: string) =>
        manager.add({ title, description, type: 'error', priority: 'high' }),
    }),
    [manager],
  );
}
