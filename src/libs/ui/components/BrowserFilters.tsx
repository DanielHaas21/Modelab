import * as React from 'react';
import { Label } from './Label';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { AssetTag } from './AssetTag';
import { CategoryCheckbox } from './CategoryCheckbox';
import { CategoryOption, CategorySelect } from './CategorySelect';

export interface TagOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}

interface BrowserFiltersProps {
  categories: CategoryOption[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  tags: TagOption[];
  setTags: React.Dispatch<React.SetStateAction<TagOption[]>>;
  className?: string;
}

/**
 * Filter for the browser
 */
export const BrowserFilters = React.forwardRef<HTMLDivElement, BrowserFiltersProps>(
  ({ categories, setCategories, tags, setTags, className }, ref) => {
    const [typeaheadSelected, setTypeaheadSelected] = React.useState<Option[]>([]);

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
            <CategorySelect categories={categories} setCategories={setCategories} isRadio={false} />
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
