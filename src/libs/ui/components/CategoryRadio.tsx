import * as React from 'react';

interface CategoryRadioProps {
  name: string;
  id: string;
  label: string;
  labelClassName?: string;
  defaultChecked?: boolean;
  onChecked?: () => void;
}

/**
 * Category Radio Button for the category filter
 */
export const CategoryRadio = React.forwardRef<HTMLInputElement, CategoryRadioProps>(
  ({ name, id, defaultChecked, label, labelClassName, onChecked }, ref) => {
    return (
      <>
        <input
          type="radio"
          className="btn-check"
          name={name}
          id={id}
          autoComplete="off"
          defaultChecked={defaultChecked}
          ref={ref}
          onChange={onChecked}
        />
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      </>
    );
  }
);
