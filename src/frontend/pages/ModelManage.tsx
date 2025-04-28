import * as React from 'react';
import {
  CategoryOption,
  CategorySelect,
  Input,
  ModelInfoSection,
  TagOption,
  TagSelect,
  UploadedFile,
} from '../../libs/ui/components';
import { useParams } from 'react-router-dom';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';

const Separator = (
  <div className="w-100 my-1 d-flex justify-content-center">
    <div className="w-80" style={{ backgroundColor: 'black', height: '1px' }} />
  </div>
);

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

  const ref = React.useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);

  const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const updatedFiles = [...files];
    updatedFiles.push(file);
    setFiles(updatedFiles);

    event.target.value = '';
  };

  return (
    <ModelDetailLayout image={null} bordered={true} goBack={false}>
      <Input
        type="text"
        className="w-100 mb-2"
        size={'lg'}
        maxLength={128}
        placeholder="Model name"
      />
      <textarea className="form-control mb-2" rows={8} maxLength={320} placeholder="Description" />
      <ModelInfoSection name="Category">
        <CategorySelect categories={categories} setCategories={setCategories} isRadio={true} />
      </ModelInfoSection>
      <ModelInfoSection name="Tags">
        <TagSelect tags={tags} setTags={setTags} />
      </ModelInfoSection>
      <ModelInfoSection name="Files">
        <div className="input-group">
          <button
            onClick={() => {
              if (!ref.current) return;
              ref.current.click();
            }}
            className="form-control text-start d-flex justify-content-between"
          >
            Upload file
            <FontAwesomeIcon icon={faFile} className="fs-2" />
          </button>
        </div>
        <Input ref={ref} onChange={addFile} className="d-none" type="file" />
        <div className="w-100">
          {files.map((file, index) => {
            return (
              <>
                <UploadedFile
                  file={file}
                  onClose={() => {
                    const updatedFiles = [...files];
                    updatedFiles.splice(index, 1);
                    setFiles(updatedFiles);
                  }}
                />
                {index < files.length - 1 && Separator}
              </>
            );
          })}
        </div>
      </ModelInfoSection>
    </ModelDetailLayout>
  );
};

export default ModelManage;
