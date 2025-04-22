import * as React from 'react';
import { Label } from './Label';
import { Input } from './Input';
import { AssetTag } from './AssetTag';

interface CategoryRadioProps {
  name: string;
  id: string;
  label: string;
  labelClassName?: string;
  defaultChecked?: boolean;
}

/**
 * Category Radio Button for the category filter
 */
const CategoryRadio = React.forwardRef<HTMLInputElement, CategoryRadioProps>(
  ({ name, id, defaultChecked, label, labelClassName }, ref) => {
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
        />
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      </>
    );
  }
);

interface BrowserFiltersProps {}

/**
 * @todo replace datalist with a custom autocomplete
 */
export const BrowserFilters = React.forwardRef<HTMLDivElement, BrowserFiltersProps>(({}, ref) => {
  const categoryFiltersId: string = 'browserFilterCateg';
  const tagDatalistId: string = 'browserFilterTags';

  const categories: { name: string; id: number }[] = [
    { name: '3D Model', id: 1 },
    { name: '2D Texture', id: 2 },
    { name: 'Audio', id: 3 },
  ];

  const [tags, setTags] = React.useState<{ name: string; id: number; isSelected?: boolean }[]>([
    { name: 'Medieval', id: 1 },
    { name: 'C4D', id: 2 },
    { name: 'Maya', id: 3 },
    { name: 'Prop', id: 4 },
    { name: 'FBX', id: 5 },
    { name: 'Unity', id: 6 },
    { name: 'Unity Second Test', id: 7 },
  ]);

  const [tagSearchText, setTagSearchText] = React.useState<string>('');

  return (
    <aside className="col-xl-2 col-4 d-flex flex-column" ref={ref}>
      <div className="w-100">
        <Label size="xs">Category</Label>
        <div className="w-100">
          {...categories.map(({ name }, index) => {
            return (
              <CategoryRadio
                id={categoryFiltersId + index}
                label={name}
                name={categoryFiltersId}
                defaultChecked={index == 0}
                labelClassName={'btn mb-1' + (index < categories.length - 1 ? ' mr-1' : '')}
              />
            );
          })}
        </div>
      </div>

      <div className="w-100 mt-4">
        <Label size="xs">Tags</Label>
        <div className="w-100">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              let tagIndex = tags.findIndex(
                ({ isSelected, name }) => !isSelected && name === tagSearchText
              );

              if (tagIndex === -1) {
                const nameRegex = new RegExp(`^${tagSearchText}`, 'i');

                const simmilarTagsIndexes: number[] = [];
                tags.forEach(({ name, isSelected }, index) => {
                  if (isSelected || !nameRegex.test(name)) return;
                  simmilarTagsIndexes.push(index);
                });

                if (simmilarTagsIndexes.length == 1) tagIndex = simmilarTagsIndexes[0];
              }

              if (tagIndex == -1) return;

              setTagSearchText('');

              const updatedTags = [...tags];
              updatedTags[tagIndex] = {
                ...updatedTags[tagIndex],
                isSelected: true,
              };
              setTags(updatedTags);
            }}
          >
            <Input
              placeholder="Search"
              list={tagDatalistId}
              className="w-100"
              value={tagSearchText}
              onChange={(event) => {
                setTagSearchText(event.target.value);
              }}
              inputGroupBefore={
                <span className="input-group-text">
                  <i className="fa-solid fa-magnifying-glass fs-2" />
                </span>
              }
            />
            <datalist id={tagDatalistId}>
              {...tags
                .filter(({ isSelected }) => !isSelected)
                .map(({ name }) => {
                  return <option value={name} />;
                })}
            </datalist>
          </form>
          <div className="w-100 mt-2 d-flex flex-wrap">
            {...tags
              .filter(({ isSelected }) => isSelected)
              .map(({ name, id }) => {
                return (
                  <AssetTag
                    name={name}
                    onClose={(_) => {
                      const tagIndex = tags.findIndex(({ id: currId }) => currId == id);
                      if (tagIndex === -1) return;

                      const updatedTags = [...tags];
                      updatedTags[tagIndex] = {
                        ...updatedTags[tagIndex],
                        isSelected: false,
                      };
                      setTags(updatedTags);
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </aside>
  );
});
