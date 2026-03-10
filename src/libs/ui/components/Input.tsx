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
  flex items-center min-h-[40px] rounded-border bg-bg-100 border border-ui-border overflow-hidden
  `,
  {
    variants: {
      size: {
        xs: ' w-[150px] ',
        sm: ' w-[200px] ',
        md: ' w-[250px] ',
        lg: ' w-[300px] ',
        xl: ' w-[400px] ',
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
          className={cn(
            'w-full bg-transparent px-3 py-2 outline-none text-text-950 placeholder:text-text-400 disabled:opacity-50',
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        {inputGroupAfter}
      </div>
    );
  }
);

Input.displayName = 'Input';
