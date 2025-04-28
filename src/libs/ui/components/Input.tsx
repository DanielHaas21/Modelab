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
  | 'list'
>;

const inputVariants = cva(
  `
  input-group min-h-40-px rounded-2 bg-light
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
  inputGroupBefore?: React.ReactNode;
  inputGroupAfter?: React.ReactNode;
  inputClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, placeholder, inputGroupBefore, inputGroupAfter, inputClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn(inputVariants({ size, className }))}>
        {inputGroupBefore}
        <input
          placeholder={placeholder}
          className={cn(inputClassName, 'form-control')}
          ref={ref}
          {...props}
        />
        {inputGroupAfter}
      </div>
    );
  }
);

Input.displayName = 'Input';
