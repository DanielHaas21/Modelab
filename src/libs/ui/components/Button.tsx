import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center 
   text-white 
   whitespace-nowrap rounded-full font-medium
   focus-visible:outline focus-visible:outline-2 
   focus-visible:outline-offset-2 disabled:pointer-events-none 
   disabled:opacity-50
   
   `,
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-500 text-black hover:bg-secondary-600 active:bg-secondary-700',
        neutral: 'bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-700',
      },
      outline: {
        true: 'border bg-transparent',
      },
      size: {
        xs: 'h-5 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
    },
    compoundVariants: [
      {
        outline: true,
        variant: 'primary',
        class: `
          border-primary-500 text-primary-500
        hover:border-primary-600 hover:text-primary-600 hover:bg-transparent
        `,
      },

      {
        outline: true,
        variant: 'secondary',
        class: `
          border-secondary-500 text-secondary-500
        hover:border-secondary-600 hover:text-secondary-600 hover:bg-transparent
        `,
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type BaseButtonAttributes = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'className' | 'disabled' | 'children'
>;

export interface ButtonProps extends BaseButtonAttributes, ButtonVariants {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size, className, outline, ...restProps } = props;

  return (
    <button
      className={cn(buttonVariants({ variant, size, className, outline }))}
      {...restProps}
      ref={ref}
    />
  );
});
Button.displayName = 'Button';
