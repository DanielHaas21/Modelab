import * as React from 'react';
import { Label } from './Label';
import { Typeahead } from 'react-bootstrap-typeahead';
import { AssetTag } from './AssetTag';
import { Option } from 'react-bootstrap-typeahead/types/types';

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
const CategoryRadio = React.forwardRef<HTMLInputElement, CategoryRadioProps>(
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

interface CategoryOption {
  name: string;
  id: number; // Unique
}

interface TagOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}

interface BrowserFiltersProps {
  categories: CategoryOption[]; // All category options
  tags: TagOption[]; // Initial tags state
  onChange?: (category: CategoryOption, tags: TagOption[]) => void; // Invoked when the overall filter state changed, returns the selected category and all selected tags
  className?: string;
}

/**
 * Filter for the browser
 */
export const BrowserFilters = React.forwardRef<HTMLDivElement, BrowserFiltersProps>(
  ({ onChange, categories, tags: defaultTags, className }, ref) => {
    const categoryFiltersId: string = 'browserFilterCateg';

    const [tags, setTags] = React.useState<TagOption[]>(defaultTags);
    const [selectedCategory, setSelectedCategory] = React.useState<CategoryOption>(categories[0]);

    const [typeaheadSelected, setTypeaheadSelected] = React.useState<Option[]>([]);

    React.useEffect(() => {
      if (onChange === undefined) return;
      onChange(
        selectedCategory,
        tags.filter((tag) => tag.isSelected)
      );
    }, [tags, selectedCategory]);

    const onTagsSelected = (selected: Option[]) => {
      setTypeaheadSelected(selected);
      if (selected.length != 1) return;
      const option = selected[0] as { label: string; value: number };

      const tagIndex = tags.findIndex((tag) => tag.id == option.value);
      if (tagIndex == -1) return;
      setTypeaheadSelected([]);

      const updatedTags = [...tags];
      updatedTags[tagIndex] = {
        ...updatedTags[tagIndex],
        isSelected: true,
      };
      setTags(updatedTags);
    };

    const onTagClosed = (tag: TagOption) => {
      const tagIndex = tags.findIndex(({ id: currId }) => currId == tag.id);
      if (tagIndex === -1) return;

      const updatedTags = [...tags];
      updatedTags[tagIndex] = {
        ...updatedTags[tagIndex],
        isSelected: false,
      };
      setTags(updatedTags);
    };

    return (
      <aside className={className + ' col-xl-2 col-4 d-flex flex-column'} ref={ref}>
        <div className="w-100">
          <Label size="xs">Category</Label>
          <div className="w-100">
            {...categories.map((category, index) => {
              return (
                <CategoryRadio
                  id={categoryFiltersId + index}
                  label={category.name}
                  name={categoryFiltersId}
                  defaultChecked={category.id == selectedCategory.id}
                  labelClassName={'btn mb-1' + (index < categories.length - 1 ? ' mr-1' : '')}
                  onChecked={() => {
                    setSelectedCategory(category);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="w-100 mt-4">
          <Label size="xs">Tags</Label>
          <div className="w-100">
            <Typeahead
              id="test"
              placeholder="Search"
              options={tags
                .filter(({ isSelected }) => !isSelected)
                .map(({ name, id }) => {
                  return { label: name, value: id };
                })}
              selected={typeaheadSelected}
              onChange={onTagsSelected}
            />
            <div className="w-100 mt-2 d-flex flex-wrap">
              {...tags
                .filter(({ isSelected }) => isSelected)
                .map((tag) => {
                  return (
                    <AssetTag
                      name={tag.name}
                      onClose={(_) => {
                        onTagClosed(tag);
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </aside>
    );
  }
);
