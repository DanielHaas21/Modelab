import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils';

const buttonVariants = cva(
  `d-flex justify-content-center align-items-center 
   fs-2 lts-3
   kanit-regular
   `,
  {
    variants: {
      variant: {
        primary: 'bg-primary btn-primary text-light border-0',
        secondary: 'bg-secondary text-light border-0',
        light: 'bg-light btn-primary text-dark border-dark',
        dark: 'bg-dark text-light border-0',
        accent: 'bg-accent  text-light border-0',
        neutral: 'bg-neutral text-dark',
      },
      outline: {
        true: 'border bg-transparent',
      },
      size: {
        xs: 'h-30-px px-1 w-150-px',
        sm: 'h-30-px px-1 w-200-px',
        md: 'h-40-px px-2 w-250-px',
        lg: 'h-50-px px-4 w-300-px',
      },
      font: {
        light: 'kanit-light',
        regular: 'kanit-regular',
        bold: 'kanit-bold',
      },
      rounding: {
        xs: 'rounded-1',
        sm: 'rounded-2',
        md: 'rounded-3',
        lg: 'rounded-4',
        xl: 'rounded-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      font:'regular',
      rounding:'md'
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type BaseButtonAttributes = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'className' | 'disabled' | 'children'
>;

export interface ButtonProps extends BaseButtonAttributes, ButtonVariants {
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant, size, rounding, font, className, outline, ...restProps } = props;

  return (
    <button
      className={cn(buttonVariants({ variant, size, font, rounding, className, outline }))}
      {...restProps}
      ref={ref}
    />
  );
});
Button.displayName = 'Button';
