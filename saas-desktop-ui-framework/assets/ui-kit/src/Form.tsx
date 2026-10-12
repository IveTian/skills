import { Form as BaseForm } from '@base-ui/react/form';
import type { ComponentProps } from 'react';
import { cx } from './cx';

export type FormProps = Omit<ComponentProps<typeof BaseForm>, 'className'> & { className?: string };

/**
 * Base UI Form：自带 noValidate，校验结果由 Field.Error 展示，不出现浏览器原生校验气泡。
 * 校验全部通过后才调用 onFormSubmit。
 */
export function Form({ className, ...rest }: FormProps) {
  return <BaseForm {...rest} className={cx('ui-form', className)} />;
}
