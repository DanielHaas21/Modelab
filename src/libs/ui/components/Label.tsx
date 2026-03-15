import * as React from 'react';
import { cn } from '../../utils';
import { cva, type VariantProps } from 'class-variance-authority';

type BaseLabelAttributes = Pick<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  'className' | 'htmlFor' | 'children' | 'id' | 'onClick' | 'onBlur' | 'onFocus'
>;

const labelVariants = cva(
  `
    text-text-950
  `,
  {
    variants: {
      size: {
        xxs: 'text-base',
        xs: 'text-xl',
        sm: 'text-2xl',
        md: 'text-[1.75rem]',
        lg: 'text-[2rem]',
        xl: 'text-[2.75rem]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type LabelVariants = VariantProps<typeof labelVariants>;

interface LabelProps extends BaseLabelAttributes, LabelVariants {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, ...props }, ref) => {
    return <label className={cn(labelVariants({ size, className }))} ref={ref} {...props} />;
  }
);

Label.displayName = 'Label';
