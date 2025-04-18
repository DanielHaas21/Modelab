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
  h-40-px rounded-2 bg-light
  `,
  {
    variants: {
      size: {
        xs: ' w-150-px ',
        sm: ' w-200-px ',
        md: ' w-250-px ',
        lg: ' w-300-px ',
        xl: ' w-400-px ',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps extends BaseInputAttributes, InputVariants {
  placeholder?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size,placeholder, ...props }, ref) => {
    return (
      <input
        placeholder={placeholder}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
