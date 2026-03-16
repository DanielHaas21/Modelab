import React from 'react';
import { CategoryCheckbox } from './CategoryCheckbox';
import { useResponsive } from '../../hooks/useResponsive';

export interface CategoryOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  isRadio: boolean; // If true, only one category can be selected at a time
}

/**
 * A component for selecting categories. It displays a list of category options as checkboxes (or radio buttons if isRadio is true)
 * @param props 
 * @returns 
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  setCategories,
  isRadio,
}) => {
  const { isDesktop } = useResponsive();

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

  if (isDesktop) {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category, index) => {
          return (
            <CategoryCheckbox
              key={category.id}
              id={'browserFilterCateg' + index}
              label={category.name}
              checked={category.isSelected !== undefined && category.isSelected}
              onChanged={() => {
                selectCategory(index, isRadio ? true : !category.isSelected);
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col content-stretch gap-2 mt-2">
      {categories.map((category, index) => {
        return (
          <CategoryCheckbox
            key={category.id}
            id={'browserFilterCateg' + index}
            label={category.name}
            checked={category.isSelected !== undefined && category.isSelected}
            onChanged={() => {
              selectCategory(index, isRadio ? true : !category.isSelected);
            }}
          />
        );
      })}
    </div>
  );
};
