import * as React from 'react';
import {
  CategoryOption,
  CategorySelect,
  FileOption,
  FileSelect,
  Input,
  ModelInfoSection,
  Preloader,
  TagOption,
  TagSelect,
} from '../../libs/ui/components';
import { useParams } from 'react-router-dom';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Asset, AssetData, Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import createModel from '../../middleware/actions/CreateModel';
import editModel from '../../middleware/actions/EditModel';

const ModelManage: React.FC = () => {
  const { action } = useParams();
  const User = useSelector((state: RootState) => state.User);

  const [refresh, setRefresh] = React.useState(0);

  const uploadAction = 'upload';
  const maxAssetNameLength = 128;
  const maxAssetDescriptionLength = 320;

  const categoryApi = new Category(import.meta.env.VITE_API_PATH);
  const tagApi = new Tag(import.meta.env.VITE_API_PATH);
  const assetApi = new Asset(import.meta.env.VITE_API_PATH);

  const [asset, setAsset] = React.useState<AssetData | null>(null);
  const [isLoadingAsset, setIsLoadingAsset] = React.useState<boolean>(action != uploadAction);
  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);
  const [assetName, setAssetName] = React.useState<string>('');
  const [assetDescription, setAssetDescription] = React.useState<string>('');
  const [files, setFiles] = React.useState<FileOption[]>([]);

  React.useEffect(() => {
    setAssetName('');
    setAssetDescription('');
    setTags(
      tags.map((tag) => {
        return {
          ...tag,
          isSelected: false,
        };
      })
    );
    setFiles([]);
  }, [action, refresh]);

  React.useEffect(() => {
    const loadCategories = async (asset: AssetData | null) => {
      try {
        const { categories } = await categoryApi.get_all();
        setCategories(
          categories.map((category) => {
            return {
              id: category.id,
              name: category.name,
              isSelected: category.id == asset?.category.id,
            };
          })
        );
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch categories', err);
        } else {
          throw err;
        }
      }
    };

    const loadTags = async (asset: AssetData | null) => {
      try {
        const { tags } = await tagApi.get_all();
        setTags(
          tags.map((tag) => {
            return {
              id: tag.id,
              name: tag.name,
              isSelected: asset?.tags.find((assetTag) => tag.id == assetTag.id) !== undefined,
            };
          })
        );
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch tags', err);
        } else {
          throw err;
        }
      }
    };

    const fetchAsset = async (id: number) => {
      try {
        const data = await assetApi.get(id);
        return data.asset;
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch assets', err);
        } else {
          throw err;
        }
      }
    };

    const fetchAssetFiles = async (id: number) => {
      try {
        const data = await assetApi.get_files(id);
        return data.files;
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch asset files', err);
        } else {
          throw err;
        }
      }
    };

    const loadAsset = async () => {
      const assetId = Number(action);

      setIsLoadingAsset(true);

      const asset = (await fetchAsset(assetId)) ?? null;
      setAsset(asset);

      setAssetName(asset?.name ?? '');
      setAssetDescription(asset?.description ?? '');

      const assetFiles = (await fetchAssetFiles(assetId)) ?? [];
      setFiles(
        assetFiles.map((file) => {
          return {
            ...file,
          };
        })
      );

      setIsLoadingAsset(false);

      return asset;
    };

    const load = async () => {
      let asset: AssetData | null = null;
      if (action != uploadAction) asset = await loadAsset();
      await loadCategories(asset);
      await loadTags(asset);
    };

    load();
  }, []);

  const uploadSave = async () => {
    if (action === 'upload') {
      await createModel({
        name: assetName,
        desc: assetDescription,
        category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
        tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
        files: files.filter((file) => file.file !== undefined),
      });
      setRefresh((prev) => prev + 1);
    } else {
      await editModel({});
    }
  };

  if (isLoadingAsset) return <Preloader className="min-h-100-vh" />;

  return (
    <ModelDetailLayout
      image={null}
      bordered={true}
      goBack={false}
      previewButtonId={asset?.id}
      uploadSaveButton={{
        id: asset?.id ?? 'upload',
        onClick: uploadSave,
      }}
    >
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
          style={{ height: '200px', resize: 'none' }}
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
