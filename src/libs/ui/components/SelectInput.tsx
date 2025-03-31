import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { SelectInputOption } from '../../types/SelectInputOption';

type BaseSelectInputAttributes = Pick<
  React.SelectHTMLAttributes<HTMLSelectElement>, 
  | 'id'
  | 'className'
  | "multiple"
  | "disabled"
  | "required"
  | "autoFocus"
>;

const SelectInputVariants = cva(
  "border rounded-md px-3 py-2 outline-none focus:ring-2 transition w-48", 
  {
    variants: {
      size: {
        sm: "text-sm py-1 px-2 w-40", 
        md: "text-base py-2 px-3 w-48", 
        lg: "text-lg py-3 px-4 w-60",
      },
      variant: {
        default: "border-gray-300 bg-white focus:ring-blue-500",
        outlined: "border border-gray-500 bg-transparent focus:ring-gray-500",
        filled: "bg-gray-100 border-none focus:ring-gray-400",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

type SelectInputVariantProps = VariantProps<typeof SelectInputVariants>;

export interface SelectInputProps extends SelectInputVariantProps, BaseSelectInputAttributes {
  className?: string;
  options: SelectInputOption[]; //can be found in /types
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({className, options,variant, size, ...props}, ref) => {
  return(
    <select
      className={cn(SelectInputVariants({ size, variant, className }))} 
      ref={ref}
      {...props}
    >
    {options.map((option, index) => (
      <option key={index} value={option.value} {...option.props}>
        {option.label}
      </option>
    ))}
    </select>
  )
});

SelectInput.displayName = "SelectInput";