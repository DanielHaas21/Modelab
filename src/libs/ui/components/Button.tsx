import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils';

const buttonVariants = cva(
  `flex items-center justify-center 
  lts-3 kanit-regular transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
   `,
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white border-0',
        secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border-0',
        light: 'bg-bg-100 hover:bg-bg-200 text-text-950 border border-ui-border',
        dark: 'bg-bg-900 hover:bg-bg-800 text-white border-0',
        accent: 'bg-accent-500 hover:bg-accent-600 text-white border-0',
        neutral: 'bg-bg-200 hover:bg-bg-300 text-text-900',
      },
      outline: {
        true: 'border-primary-500 border bg-transparent hover:bg-primary-500/10',
      },
      size: {
        xs: 'h-[30px] px-1 w-[150px]',
        sm: 'h-[30px] px-1 w-[200px]',
        md: 'h-[40px] px-2 w-[250px]',
        lg: 'h-[50px] px-4 w-[300px]',
      },
      font: {
        light: 'kanit-light',
        regular: 'kanit-regular',
        bold: 'kanit-bold',
      },
      rounding: {
        xs: 'rounded-sm',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-2xl',
      },
      font_size: {
        sm: 'fs-1',
        md: 'fs-2',
        lg: 'fs-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      font: 'regular',
      rounding: 'md',
      font_size: 'md',
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type BaseButtonAttributes = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'className' | 'disabled' | 'children' | 'autoFocus'
>;

export interface ButtonProps extends BaseButtonAttributes, ButtonVariants { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size, rounding, font, className, outline, font_size, ...restProps } = props;

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, font, font_size, rounding, className, outline })
      )}
      {...restProps}
      ref={ref}
    />
  );
});
Button.displayName = 'Button';
