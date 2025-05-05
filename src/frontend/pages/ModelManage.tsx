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
        'You have unsaved changes, Are you sure you want to leave ?',
        true,
        dispatch
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
    if (assetName == '' || assetDescription == '' || files.length == 0) {
      await confirm('Name, Description and uploading files is requiered', false, dispatch);

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
      await editModel({});
    }
  };
  if (isLoadingAsset) return <Preloader className="min-h-100-vh" />;

  console.log(files)
  return (
    <>
      <GeneralPopup></GeneralPopup>
      <ModelDetailLayout
        image={files.map((file) => ({
          name: file.name,
          bin: import.meta.env.VITE_API_PATH + `file/${file.id}`,
          type: file.type,
        }))}
        bordered={true}
        goBack={false}
        previewButtonId={asset?.id}
        previewButtonOnCLick={CheckChange}
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
    </>
  );
};

export default ModelManage;
