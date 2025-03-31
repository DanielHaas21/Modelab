import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

type BaseInputAttributes = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'id'
  | 'name'
  | 'placeholder'
  | 'tabIndex'
  | 'autoFocus'
  | 'autoComplete'
  | 'readOnly'
  | 'required'
  | 'min'
  | 'max'
  | 'step'
  | 'pattern'
  | 'maxLength'
  | 'minLength'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseOver'
  | 'onClick'
  | 'className'
  | 'disabled'
  | 'type'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
>;

const inputVariants = cva(
  `
    h-11 w-full rounded-md bg-neutral-100 
    font-normal text-neutral-600 placeholder:text-neutral-300
    disabled:cursor-not-allowed disabled:text-text-secondary
    outline-none border-none focus:border-focused focus:ring-2 focus:ring-focused
  `,
  {
    variants: {
      size: {
        xs: 'h-5 px-3 py-1 text-xs',
        sm: 'h-9 px-4 py-4 text-sm',
        md: 'h-10 px-4 py-6 text-base',
        lg: 'h-12 px-5 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps extends BaseInputAttributes, InputVariants {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => {
    return <input className={cn(inputVariants({ size, className }))} ref={ref} {...props} />;
  }
);

Input.displayName = 'Input';
