import * as React from 'react';
import {
  CategoryOption,
  CategorySelect,
  FileOption,
  FileSelect,
  GeneralPopup,
  Input,
  ModelInfoSection,
  Preloader,
  TagOption,
  TagSelect,
} from '../../libs/ui/components';
import { useNavigate, useParams } from 'react-router-dom';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Asset, AssetData, Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';
import createModel from '../../middleware/actions/CreateModel';
import editModel from '../../middleware/actions/EditModel';
import { EditChanges } from '../types/EditChanges';
import { compareObjects } from '../../libs/utils';
import { confirm } from '../../libs/ui/components';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { useValidatePermission } from '../../libs/auth';
import { useModelFromUpload } from '../../libs/hooks/useModelFromUpload';
import { Add } from '../../store/slices/Message';

const ModelManage: React.FC = () => {
  useValidatePermission(2, '/Browser');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { action } = useParams();

  const [refresh, setRefresh] = React.useState<number>(0);
  const [initialChanges, setInitialChanges] = React.useState<EditChanges | null>(null);

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
    setAsset(null);
    setAssetName('');
    setAssetDescription('');
    setTags(
      tags.map((tag) => ({
        ...tag,
        isSelected: false,
      }))
    );
    setFiles([]);
  }, [action, refresh]);

  React.useEffect(() => {
    const loadCategories = async (asset: AssetData | null) => {
      try {
        const { categories } = await categoryApi.get_all();
        setCategories(
          categories.map((category) => ({
            id: category.id,
            name: category.name,
            isSelected: category.id == asset?.category.id,
          }))
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
          tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            isSelected: asset?.tags.find((assetTag) => tag.id == assetTag.id) !== undefined,
          }))
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
        assetFiles.map((file) => ({
          ...file,
        }))
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

  React.useEffect(() => {
    if (categories.length === 0 || tags.length === 0) return;
    if (initialChanges !== null) return; // if already set do not overrride

    setInitialChanges({
      name: assetName,
      description: assetDescription,
      category: categories.find((cat) => cat.isSelected) ?? categories[0],
      tags: tags.filter((tag) => tag.isSelected),
      files: files,
    });
  }, [assetName, assetDescription, categories, tags, files]);

  const CheckChange = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (
      assetName !== initialChanges?.name ||
      assetDescription !== initialChanges.description ||
      !compareObjects(
        categories.find((cat) => cat.isSelected) ?? categories[0],
        initialChanges.category
      ) ||
      !compareObjects(
        tags.filter((tag) => tag.isSelected),
        initialChanges.tags
      ) ||
      !compareObjects(files, initialChanges.files)
    ) {
      const userConfirmed = await confirm(
        'Unsaved changes!',
        true,
        dispatch,
        undefined,
        undefined,
        <p>Are you sure you want to leave?</p>
      );

      if (userConfirmed) {
        navigate('/models/' + asset?.id);
      } else {
        return;
      }
    } else {
      navigate('/models/' + asset?.id);
    }
  };

  const uploadSave = async () => {
    if (
      assetName == '' ||
      assetDescription == '' ||
      files.length == 0 ||
      tags.filter((tag) => tag.isSelected == true).length == 0
    ) {
      await confirm(
        'Not enough data!',
        false,
        dispatch,
        undefined,
        undefined,
        <p>name, description, files, and a tag is requiered</p>
      );

      return;
    }

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
      await editModel({
        id: asset!.id,
        name: assetName,
        desc: assetDescription,
        category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
        tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
        files: files.filter((file) => file.file !== undefined),
      });
      setInitialChanges({
        name: assetName,
        description: assetDescription,
        category: categories.find((cat) => cat.isSelected) ?? categories[0],
        tags: tags.filter((tag) => tag.isSelected),
        files: files,
      });
      dispatch(Add({
        message: 'Saved!',
        variant: 'Success'
      }))
    }
  };
  if (isLoadingAsset) return <Preloader className="min-h-screen" />;

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        image={files.map((file) => ({
          name: file.name,
          bin: useModelFromUpload(file),
          type: file.type,
        }))}
        bordered={true}
        goBack={false}
        previewButtonId={asset?.id}
        previewButtonOnCLick={CheckChange}
        uploadSaveButton={{
          type: asset?.id ? 'save' : 'upload',
          onClick: uploadSave,
        }}
      >
        <div className="relative mb-4 group">
          <Input
            type="text"
            className="w-full"
            inputClassName="text-xl font-medium tracking-wide"
            size={'xl'}
            maxLength={maxAssetNameLength}
            placeholder="Asset name"
            value={assetName}
            onChange={(event) => {
              setAssetName(event.target.value.substring(0, maxAssetNameLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {assetName.length} / {maxAssetNameLength}
          </p>
        </div>
        
        <div className="relative mb-4 group">
          <textarea
            className="w-full bg-bg-100 border border-ui-border rounded-lg p-4 h-[200px] resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-text-950 transition-all kanit-light"
            rows={8}
            maxLength={maxAssetDescriptionLength}
            placeholder="Asset description"
            value={assetDescription}
            onChange={(event) => {
              setAssetDescription(event.target.value.substring(0, maxAssetDescriptionLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {assetDescription.length} / {maxAssetDescriptionLength}
          </p>
        </div>

        <ModelInfoSection name="Category">
          <CategorySelect categories={categories} setCategories={setCategories} isRadio={true} />
        </ModelInfoSection>
        
        <ModelInfoSection name="Tags" className="mt-6">
          <TagSelect tags={tags} setTags={setTags} />
        </ModelInfoSection>
        
        <ModelInfoSection name="Files" className="mt-6 pb-10">
          <FileSelect files={files} setFiles={setFiles} />
        </ModelInfoSection>
      </ModelDetailLayout>
    </>
  );
};

export default ModelManage;
