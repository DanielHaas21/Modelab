import * as React from 'react';
import {
  CategoryOption,
  CategorySelect,
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
import { confirm } from '../../libs/ui/components';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { BrowserRoutes } from '../../global/BrowserRoutes';
import { DetailFile, LocalManageFile, ManageFile, ModelManageData } from '../../middleware/types';
import loadModelManage from '../../middleware/actions/LoadModelManage';
import { getFileGroup, SupportedFileTypes } from '../../libs/utils';
import { FILE } from '../../middleware/ApiClients';
import { Add } from '../../store/slices/Message';
import createModel from '../../middleware/actions/CreateModel';
import editModel from '../../middleware/actions/EditModel';
import deleteModel from '../../middleware/actions/DeleteModel';

const createDetailFileFromLocalFile = async (localFile: LocalManageFile, supportedFileTypes: SupportedFileTypes): Promise<DetailFile | null> => {
  const blob = new Blob([localFile.localFile], { type: localFile.type });
  const fileBase = {
    id: -1,
    download: async () => blob,
    previewUrl: 'preview',
    name: localFile.name,
    fileType: localFile.fileType,
  };

  const group = getFileGroup(localFile.fileType, supportedFileTypes);
  switch (group) {
    case 'audio':
      const audioUrl = URL.createObjectURL(blob);
      return {
        ...fileBase,
        type: 'audio',
        audioUrl: audioUrl,
      };
      break;
    case 'image':
      const imageUrl = URL.createObjectURL(blob);
      return {
        ...fileBase,
        type: 'image',
        imageUrl,
      };
      break;
    case 'model':
      const model = await FILE.loadModelFromLocalFile(localFile.localFile, localFile.fileType);
      return {
        ...fileBase,
        type: '3d',
        model,
      };
    case 'other':
      return {
        ...fileBase,
        type: 'other',
      };
      break;
  }
  return null;
}

const createDetailFiles = async (manageFiles: ManageFile[], supportedFileTypes: SupportedFileTypes): Promise<DetailFile[]> => {
  const files: DetailFile[] = [];
  for (const manageFile of manageFiles) {
    let file: DetailFile | null = null;

    switch (manageFile.type) {
      case 'fetched':
        file = manageFile.detailFile;
        break;
      case 'local':
        file = await createDetailFileFromLocalFile(manageFile, supportedFileTypes);
        break;
    }

    if (file !== null) files.push(file);
  }
  return files;
}

const ModelManage: React.FC = () => {
  const { action } = useParams();
  const assetId = isFinite(Number(action)) ? Number(action) : undefined;

  // useValidatePermission(CLEARANCE.ADMIN, assetId !== undefined ? (BrowserRoutes.ModelDetail + assetId) : BrowserRoutes.Browser);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const maxAssetNameLength = 128;
  const maxAssetDescriptionLength = 320;

  const [refreshModel, setRefreshModel] = React.useState<number>(0);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modelManageData, setModelManageData] = React.useState<ModelManageData | null>(null);

  const [assetNameInput, setAssetNameInput] = React.useState<string>('');
  const [assetDescriptionInput, setAssetDescriptionInput] = React.useState<string>('');
  const [categoriesInput, setCategoriesInput] = React.useState<CategoryOption[]>([]);
  const [tagsInput, setTagsInput] = React.useState<TagOption[]>([]);
  const [filesInput, setFilesInput] = React.useState<ManageFile[]>([]);

  const [previewDetailFiles, setPreviewDetailFiles] = React.useState<DetailFile[]>([]);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const modelData = await loadModelManage(assetId ?? null);
        setModelManageData(modelData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
      setIsLoading(false);
    })();
  }, [assetId, refreshModel]);

  React.useEffect(() => {
    if (!modelManageData) return;

    const model = modelManageData.model;
    const config = modelManageData.config;
    const tagIds = model?.tags.map(t => t.id) ?? [];

    setCategoriesInput(config.allCategories.map(category => ({
      ...category,
      isSelected: category.id === model?.category.id
    })) ?? []);

    setTagsInput(config.allTags.map(tag => ({
      ...tag,
      isSelected: tagIds.includes(tag.id)
    })) ?? []);

    setFilesInput(model?.files ?? []);

    setAssetNameInput(model?.name ?? '');
    setAssetDescriptionInput(model?.description ?? '');
  }, [modelManageData]);

  React.useEffect(() => {
    if (!modelManageData) return;
    const config = modelManageData.config;
    (async () => {
      const detailFiles = await createDetailFiles(filesInput, config.supportedFileTypes);
      setPreviewDetailFiles(detailFiles);
    })();
  }, [filesInput, modelManageData]);

  const handleDelete = async () => {
    if (assetId === undefined) return;
    const userConfirmedNo = await confirm(
      'Delete asset?',
      true,
      dispatch,
      'No',
      'Yes',
      <p>Are you sure you want to delete <span className='text-2xl'>`{modelManageData?.model?.name ?? assetNameInput}`</span>?<br /><b>This can't be undone.</b></p>
    );

    if (userConfirmedNo) return;
    await deleteModel({
      id: assetId
    });
    navigate(BrowserRoutes.Browser);
  };

  const handleShowPreview = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (modelManageData === null || modelManageData.model === null) return;
    const model = modelManageData.model;

    const selectedCategory = categoriesInput.find((category) => category.isSelected);
    const selectedTags = tagsInput.filter(tag => tag.isSelected);

    if (assetNameInput === model.name
      && assetDescriptionInput === model.description
      && selectedCategory?.id === model.category.id
      && selectedTags.length === model.tags.length
      && selectedTags.every((tag) => model.tags.find((modelTag) => tag.id === modelTag.id) !== undefined)
      && filesInput.length === model.files.length
      && filesInput.every((file) =>
        file.type === 'fetched'
        && model.files.find((modelFile) =>
          modelFile.type === 'fetched'
          && file.detailFile.id === modelFile.detailFile.id
        ) !== undefined
      )
    ) {
      navigate(BrowserRoutes.ModelDetail + assetId);
      return;
    }

    const userConfirmedLeave = await confirm(
      'Unsaved changes!',
      true,
      dispatch,
      'Leave',
      'Go back',
      <p>Are you sure you want to leave?</p>
    );

    if (userConfirmedLeave) {
      navigate(BrowserRoutes.ModelDetail + assetId);
    }
  };

  const handleUploadOrSave = async () => {
    if (
      assetNameInput.length === 0 ||
      assetDescriptionInput.length === 0 ||
      filesInput.length === 0 ||
      tagsInput.filter((tag) => tag.isSelected).length === 0
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

    if (assetId !== undefined) {
      await editModel({
        id: assetId,
        name: assetNameInput,
        desc: assetDescriptionInput,
        category: categoriesInput.find((category) => category.isSelected)?.id ?? 1,
        tags: tagsInput.filter((tag) => tag.isSelected).map((tag) => tag.id),
        files: filesInput.filter((file) => file.type === 'local'),
      });
      setRefreshModel((i) => i + 1);
      dispatch(Add({
        message: 'Saved!',
        variant: 'Success'
      }))
    } else {
      await createModel({
        name: assetNameInput,
        desc: assetDescriptionInput,
        category: categoriesInput.find((category) => category.isSelected)?.id ?? 1,
        tags: tagsInput.filter((tag) => tag.isSelected).map((tag) => tag.id),
        files: filesInput.filter((file) => file.type === 'local'),
      });
      setRefreshModel((i) => i + 1);
      dispatch(Add({
        message: 'Uploaded!',
        variant: 'Success'
      }))
    }
  };

  if (isLoading) return <Preloader className="min-h-screen" />;

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        files={previewDetailFiles}
        bordered={true}
        previewButton={assetId !== undefined ? {
          id: assetId,
          onClick: handleShowPreview
        } : undefined}
        deleteButton={assetId !== undefined ? {
          id: assetId,
          onClick: handleDelete
        } : undefined}
        uploadSaveButton={{
          type: assetId ? 'save' : 'upload',
          onClick: handleUploadOrSave,
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
            value={assetNameInput}
            onChange={(event) => {
              setAssetNameInput(event.target.value.substring(0, maxAssetNameLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {assetNameInput.length} / {maxAssetNameLength}
          </p>
        </div>

        <div className="relative mb-4 group">
          <textarea
            className="w-full bg-bg-100 border border-ui-border rounded-lg p-4 h-50 resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-text-950 transition-all font-light"
            rows={8}
            maxLength={maxAssetDescriptionLength}
            placeholder="Asset description"
            value={assetDescriptionInput}
            onChange={(event) => {
              setAssetDescriptionInput(event.target.value.substring(0, maxAssetDescriptionLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {assetDescriptionInput.length} / {maxAssetDescriptionLength}
          </p>
        </div>

        <ModelInfoSection name="Category">
          <CategorySelect categories={categoriesInput} setCategories={setCategoriesInput} isRadio={true} />
        </ModelInfoSection>

        <ModelInfoSection name="Tags" className="mt-6">
          <TagSelect tags={tagsInput} setTags={setTagsInput} />
        </ModelInfoSection>

        <ModelInfoSection name="Files" className="mt-6">
          <FileSelect files={filesInput} setFiles={setFilesInput} />
        </ModelInfoSection>
      </ModelDetailLayout>
    </>
  );
};

export default ModelManage;
