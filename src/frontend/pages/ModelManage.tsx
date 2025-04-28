import * as React from 'react';
import {
  CategoryOption,
  CategorySelect,
  FileSelect,
  Input,
  ModelInfoSection,
  TagOption,
  TagSelect,
} from '../../libs/ui/components';
import { useParams } from 'react-router-dom';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';

const ModelManage: React.FC = () => {
  const { action } = useParams();
  const categoryApi = new Category(import.meta.env.VITE_API_PATH);
  const tagApi = new Tag(import.meta.env.VITE_API_PATH);

  if (action == 'upload') {
  } else {
    const modelId = Number(action);
  }

  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);
  const [assetName, setAssetName] = React.useState<string>('');
  const [assetDescription, setAssetDescription] = React.useState<string>('');
  const [files, setFiles] = React.useState<File[]>([]);

  const maxAssetNameLength = 128;
  const maxAssetDescriptionLength = 320;

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.get_all();
        setCategories(data.categories);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch categories', err);
        }
      }
    };

    const fetchTags = async () => {
      try {
        const data = await tagApi.get_all();
        setTags(data.tags);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch categories', err);
        }
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  return (
    <ModelDetailLayout image={null} bordered={true} goBack={false}>
      <div className="position-relative">
        <Input
          type="text"
          className="w-100 mb-2"
          inputClassName="fs-4"
          size={'xl'}
          maxLength={maxAssetNameLength}
          placeholder="Asset name"
          value={assetName}
          onChange={(event) => {
            setAssetName(event.target.value.substring(0, maxAssetNameLength));
          }}
        />
        <p className="position-absolute" style={{ right: '8px', bottom: 0, zIndex: 10000 }}>
          {assetName.length} / {maxAssetNameLength}
        </p>
      </div>
      <div className="position-relative">
        <textarea
          className="form-control mb-2"
          style={{ height: '139px', resize: 'none' }}
          rows={8}
          maxLength={maxAssetDescriptionLength}
          placeholder="Asset description"
          value={assetDescription}
          onChange={(event) => {
            setAssetDescription(event.target.value.substring(0, maxAssetDescriptionLength));
          }}
        />
        <p className="position-absolute" style={{ right: '8px', bottom: 0 }}>
          {assetDescription.length} / {maxAssetDescriptionLength}
        </p>
      </div>
      <ModelInfoSection name="Category">
        <CategorySelect categories={categories} setCategories={setCategories} isRadio={true} />
      </ModelInfoSection>
      <ModelInfoSection name="Tags">
        <TagSelect tags={tags} setTags={setTags} />
      </ModelInfoSection>
      <ModelInfoSection name="Files">
        <FileSelect files={files} setFiles={setFiles} />
      </ModelInfoSection>
    </ModelDetailLayout>
  );
};

export default ModelManage;
