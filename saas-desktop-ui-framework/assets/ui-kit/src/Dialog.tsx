import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { Button } from './Button';

/** Base UI Dialog 封装：普通对话框（表单、详情）。 */
export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <BaseDialog.Root open={props.open} onOpenChange={(o) => props.onOpenChange(o)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="ui-backdrop" />
        <BaseDialog.Popup className="ui-dialog">
          <BaseDialog.Title className="ui-dialog__title">{props.title}</BaseDialog.Title>
          {props.description && (
            <BaseDialog.Description className="ui-dialog__description">
              {props.description}
            </BaseDialog.Description>
          )}
          {props.children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="ui-dialog__footer">{children}</div>;
}

/** Base UI AlertDialog 封装：需要用户明确确认的操作（归档、删除）。 */
export function ConfirmDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={props.open} onOpenChange={(o) => props.onOpenChange(o)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="ui-backdrop" />
        <AlertDialog.Popup className="ui-dialog">
          <AlertDialog.Title className="ui-dialog__title">{props.title}</AlertDialog.Title>
          <AlertDialog.Description className="ui-dialog__description">
            {props.description}
          </AlertDialog.Description>
          {props.error && (
            <p className="ui-field__error" role="alert">
              {props.error}
            </p>
          )}
          <div className="ui-dialog__footer">
            <AlertDialog.Close render={<Button variant="secondary" />}>
              {props.cancelLabel ?? '取消'}
            </AlertDialog.Close>
            <Button
              variant={props.tone === 'danger' ? 'danger-solid' : 'primary'}
              onClick={props.onConfirm}
              loading={props.pending}
            >
              {props.pending ? (props.pendingLabel ?? '处理中…') : props.confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
