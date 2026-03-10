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
        xxs: 'fs-1',
        xs: 'fs-2',
        sm: 'fs-3',
        md: 'fs-4',
        lg: 'fs-5',
        xl: 'fs-8',
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
