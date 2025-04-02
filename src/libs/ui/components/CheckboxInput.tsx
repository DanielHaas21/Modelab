import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

type BaseCheckboxInputAttributes = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className' | 'disabled' | 'checked' | 'onChange' | 'onClick'
> & {
  'aria-label'?: string; //Has to be a string explicitely
};

const CheckboxInputVariants = cva(
  'rounded border transition focus:ring-2 focus:ring-offset-2 cursor-pointer',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      variant: {
        default: 'border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500',
        outlined: 'border border-gray-500 bg-transparent checked:border-gray-700',
        filled: 'bg-gray-200 border-none checked:bg-gray-600',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

type CheckboxInputVariantProps = VariantProps<typeof CheckboxInputVariants>;

export interface CheckboxInputProps extends BaseCheckboxInputAttributes, CheckboxInputVariantProps {
  className?: string;
  labelText?: string; // optional text next to the checkbox
}

export const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
  ({ className, size, variant, labelText, ...props }, ref) => {
    return labelText ? (
      <label className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(CheckboxInputVariants({ size, variant }), className)}
          {...props}
        />
        <span className="ml-2">{labelText}</span>
      </label>
    ) : (
      <input
        type="checkbox"
        ref={ref}
        className={cn(CheckboxInputVariants({ size, variant }), className)}
        {...props}
      />
    );
  }
);

CheckboxInput.displayName = 'CheckboxInput';
