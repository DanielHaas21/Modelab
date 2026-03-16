import * as React from 'react';
import { cn } from '../../utils';

interface CategoryCheckboxProps {
  id: string;
  label: string;
  labelClassName?: string;
  className?: string;
  checked?: boolean;
  onChanged?: () => void;
}

/**
 * A component that renders a checkbox with a label. 
 */
export const CategoryCheckbox = React.forwardRef<HTMLInputElement, CategoryCheckboxProps>(
  ({ id, checked, label, labelClassName, className, onChanged }, ref) => {
    return (
      <div className={cn('inline-block', className)}>
        <input
          type="checkbox"
          className="peer hidden"
          ref={ref}
          id={id}
          autoComplete="off"
          checked={checked}
          onChange={onChanged}
        />
        <label
          className={cn(
            'inline-flex items-center justify-center w-full px-3 py-1.5 rounded-md border border-ui-border cursor-pointer transition-all duration-200 peer-checked:bg-primary-500 peer-checked:text-white peer-checked:border-primary-500 hover:bg-primary-500/10 hover:border-primary-500 hover:text-primary-500 peer-checked:hover:bg-primary-600 peer-checked:hover:text-white text-sm font-normal',
            labelClassName
          )}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
);
