import * as React from 'react';
import { cn } from '../../utils';
import { cva, type VariantProps } from 'class-variance-authority';

type BaseLabelAttributes = Pick<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  'className' | 'htmlFor' | 'children' | 'id' | 'onClick' | 'onBlur' | 'onFocus'
>;

const labelVariants = cva(
  `
    dark:text-neutral-100
  `,
  {
    variants: {
      size: {
        xxs: 'fs-4',
        xs: 'fs-5',
        sm: 'fs-6',
        md: 'fs-7',
        lg: 'fs-8',
        xl: 'fs-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type LabelVariants = VariantProps<typeof labelVariants>;

interface LabelProps extends BaseLabelAttributes, LabelVariants {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, ...props }, ref) => {
    return <label className={cn(labelVariants({ size, className }))} ref={ref} {...props} />;
  }
);

Label.displayName = 'Label';
