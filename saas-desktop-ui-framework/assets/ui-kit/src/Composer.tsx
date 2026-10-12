import { Field } from '@base-ui/react/field';
import { ArrowUp, Stop } from './icons';
import type { KeyboardEvent, ReactNode } from 'react';
import { Button } from './Button';
import { Form } from './Form';
import { Tooltip } from './Tooltip';

/**
 * 输入框（Composer）：多行输入 + 底部工具行 + 发送按钮。
 * ⏎ 发送、⇧⏎ 换行；中文输入法组字过程中的回车不会触发发送。
 */
export function Composer(props: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  /** 整个输入框不可用（例如功能尚未开放）。 */
  disabled?: boolean;
  /** 发送按钮不可用的原因；为空表示可以发送。 */
  blockedReason?: string | null;
  pending?: boolean;
  /** 底部左侧的工具（上下文选择、附件等）。 */
  toolbar?: ReactNode;
  hint?: ReactNode;
  /** 最少显示的行数（1–3）；输入增多时自动增高，到上限后滚动。 */
  rows?: 1 | 2 | 3;
  autoFocus?: boolean;
  maxLength?: number;
  /** 有运行进行中：发送按钮换成停止按钮。 */
  onStop?: () => void;
  stopping?: boolean;
}) {
  const canSend =
    !props.disabled && !props.pending && !props.blockedReason && props.value.trim().length > 0;
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (canSend) e.currentTarget.form?.requestSubmit();
  };
  const send = props.onStop ? (
    <Button
      type="button"
      variant="send"
      loading={props.stopping}
      disabled={props.stopping}
      aria-label="停止"
      onClick={props.onStop}
    >
      {!props.stopping && <Stop aria-hidden="true" />}
    </Button>
  ) : (
    <Button
      type="submit"
      variant="send"
      disabled={!canSend}
      loading={props.pending}
      aria-label="发送"
    >
      {!props.pending && <ArrowUp aria-hidden="true" />}
    </Button>
  );

  return (
    <Form
      className="ui-composer"
      data-disabled={props.disabled || undefined}
      onFormSubmit={() => canSend && props.onSubmit()}
    >
      <Field.Root disabled={props.disabled}>
        <Field.Label className="ui-sr-only">{props.label}</Field.Label>
        <Field.Control
          className="ui-composer__input"
          value={props.value}
          onValueChange={(v) => props.onValueChange(v)}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          maxLength={props.maxLength}
          data-rows={props.rows ?? 2}
          render={<textarea rows={props.rows ?? 2} onKeyDown={onKeyDown} />}
        />
      </Field.Root>
      <div className="ui-composer__bar">
        {props.toolbar}
        <span className="ui-composer__hint">
          {props.hint ?? (props.disabled ? null : '⏎ 发送 · ⇧⏎ 换行')}
        </span>
        {props.blockedReason && !props.disabled && !props.onStop ? (
          <Tooltip content={props.blockedReason}>{send}</Tooltip>
        ) : (
          send
        )}
      </div>
    </Form>
  );
}
