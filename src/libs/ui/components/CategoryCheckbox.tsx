import * as React from 'react';

interface CategoryCheckboxProps {
  id: string;
  label: string;
  labelClassName?: string;
  checked?: boolean;
  onChanged?: () => void;
}

export const CategoryCheckbox = React.forwardRef<HTMLInputElement, CategoryCheckboxProps>(
  ({ id, checked, label, labelClassName, onChanged }, ref) => {
    return (
      <>
        <input
          type="checkbox"
          className="btn-check"
          ref={ref}
          id={id}
          autoComplete="off"
          checked={checked}
          onChange={onChanged}
        />
        <label className={'btn ' + labelClassName} htmlFor={id}>
          {label}
        </label>
      </>
    );
  }
);
