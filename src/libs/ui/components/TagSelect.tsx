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
  const [searchValue, setSearchValue] = React.useState('');

  const onTagSelected = (tagId: number) => {
    const tagIndex = tags.findIndex((tag) => tag.id === tagId);
    if (tagIndex === -1) return;

    const updatedTags = [...tags];
    updatedTags[tagIndex] = {
      ...updatedTags[tagIndex],
      isSelected: true,
    };
    setTags(updatedTags);
    setSearchValue('');
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

  const availableTags = tags.filter(({ isSelected }) => !isSelected);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          list="tag-options"
          placeholder="Search and select tags..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            const selectedTag = availableTags.find(t => t.name === e.target.value);
            if (selectedTag) {
                onTagSelected(selectedTag.id);
            }
          }}
          className="w-full bg-bg-100 border border-ui-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm kanit-regular"
        />
        <datalist id="tag-options">
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.name} />
          ))}
        </datalist>
      </div>
      
      <div className="w-full mt-3 flex flex-wrap gap-1">
        {tags
          .filter(({ isSelected }) => isSelected)
          .map((tag) => {
            return (
              <AssetTag
                key={tag.id}
                name={tag.name}
                onClose={() => {
                  onTagClosed(tag);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
