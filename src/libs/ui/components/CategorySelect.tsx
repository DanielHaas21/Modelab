import React from 'react';
import { CategoryCheckbox } from './CategoryCheckbox';

export interface CategoryOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  isRadio: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  setCategories,
  isRadio,
}) => {
  const selectCategory = (index: number, isSelected: boolean) => {
    const updatedCategories = [...categories];

    if (isRadio) {
      for (let i = 0; i < updatedCategories.length; i++) {
        updatedCategories[i].isSelected = false;
      }
    }

    updatedCategories[index] = {
      ...updatedCategories[index],
      isSelected: isSelected,
    };
    setCategories(updatedCategories);
  };

  React.useEffect(() => {
    if (categories.length == 0) return;
    if (isRadio && categories.find((category) => category.isSelected) === undefined) {
      selectCategory(0, true);
    }
  }, [categories]);

  return (
    <>
      {...categories.map((category, index) => {
        return (
          <CategoryCheckbox
            id={'browserFilterCateg' + index}
            label={category.name}
            checked={category.isSelected !== undefined && category.isSelected}
            labelClassName={'btn mb-1' + (index < categories.length - 1 ? ' mr-1' : '')}
            onChanged={() => {
              selectCategory(index, isRadio ? true : !category.isSelected);
            }}
          />
        );
      })}
    </>
  );
};
