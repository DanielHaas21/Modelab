import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { AssetTag } from './AssetTag';
import React from 'react';

export interface TagOption {
  name: string;
  id: number; // Unique
  isSelected?: boolean;
}

interface TagSelectProps {
  tags: TagOption[];
  setTags: React.Dispatch<React.SetStateAction<TagOption[]>>;
}

export const TagSelect: React.FC<TagSelectProps> = ({ tags, setTags }) => {
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
    <>
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
        className="min-h-40-px w-100"
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
    </>
  );
};
