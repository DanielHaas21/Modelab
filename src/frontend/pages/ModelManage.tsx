import * as React from 'react';
import {
  Button,
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { confirm } from '../../libs/ui/components';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { BrowserRoutes } from '../../global/BrowserRoutes';
import { DetailFile, ManageFile, ModelManageData } from '../../middleware/types';
import loadModelManage from '../../middleware/actions/LoadModelManage';
import createModel from '../../middleware/actions/CreateModel';
import editModel from '../../middleware/actions/EditModel';
import deleteModel from '../../middleware/actions/DeleteModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faSave, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../../libs/ui/components/Toast';
import { useValidatePermission } from '../../libs/auth';
import { CLEARANCE } from '../../store/types';
import { createDetailFiles } from '../../middleware/actions/CreateDetailFile';
import { useTranslation } from '../../libs/ui/provider';


const ModelManage: React.FC = () => {
  const { action } = useParams();
  const assetId = isFinite(Number(action)) ? Number(action) : undefined;
  const { show } = useToast();
  const t = useTranslation("pages.model_manage");

  useValidatePermission(CLEARANCE.ADMIN, assetId !== undefined ? (BrowserRoutes.ModelDetail + assetId) : BrowserRoutes.Browser);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const maxAssetNameLength = 128;
  const maxAuthorNameLength = 128;
  const maxAssetDescriptionLength = 320;

  const [refreshModel, setRefreshModel] = React.useState<number>(0);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modelManageData, setModelManageData] = React.useState<ModelManageData | null>(null);

  const [assetNameInput, setAssetNameInput] = React.useState<string>('');
  const [authorNameInput, setAuthorNameInput] = React.useState<string>('');
  const [assetDescriptionInput, setAssetDescriptionInput] = React.useState<string>('');
  const [categoriesInput, setCategoriesInput] = React.useState<CategoryOption[]>([]);
  const [tagsInput, setTagsInput] = React.useState<TagOption[]>([]);
  const [filesInput, setFilesInput] = React.useState<ManageFile[]>([]);

  const [previewDetailFiles, setPreviewDetailFiles] = React.useState<DetailFile[]>([]);

  React.useEffect(() => {

    // model load
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

  // set data
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
    setAuthorNameInput(model?.author ?? '');
    setAssetDescriptionInput(model?.description ?? '');
  }, [modelManageData]);

  // uploaded files added to preview
  React.useEffect(() => {
    if (!modelManageData) return;
    const config = modelManageData.config;
    (async () => {
      const detailFiles = await createDetailFiles(filesInput, config.supportedFileTypes);
      setPreviewDetailFiles(detailFiles);
    })();
  }, [filesInput, modelManageData]);

  // delete model and return to browser
  const handleDelete = async () => {
    if (assetId === undefined) return;
    const userConfirmedNo = await confirm(
      t('confirm.delete'),
      true,
      dispatch,
      t('confirm.no'),
      t('confirm.yes'),
      <p>{t("confirm.sure_delete")}<span className='text-2xl'>`{modelManageData?.model?.name ?? assetNameInput}`</span>?<br /><b>{t("confirm.cant_undo")}</b></p>
    );

    if (userConfirmedNo) return;
    await deleteModel({
      id: assetId
    });
    navigate(BrowserRoutes.Browser);
  };

  // check if there are unsaved changes and show preview
  // preview is a read only page, that looks the same as model detail page, but with the current input data instead of the original model data
  const handleShowPreview = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // check if there are unsaved changes
    if (modelManageData === null || modelManageData.model === null) return;
    const model = modelManageData.model;

    // check if there are changes in name, description, category, tags or files
    // There musnt be any change for the user to be able to see the preview without confirmation, even if there are changes in files
    // The user must confirm, because the preview files are generated from the current files input, and if there are changes in files, the preview might look different than the model detail page, which can be confusing for the user
    const selectedCategory = categoriesInput.find((category) => category.isSelected);
    const selectedTags = tagsInput.filter(tag => tag.isSelected);

    if (assetNameInput === model.name
      && authorNameInput === model.author
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
      t('unsaved.title'),
      true,
      dispatch,
      t('unsaved.leave'),
      t('unsaved.go_back'),
      <p>{t('unsaved.sure_leave')}</p>
    );

    if (userConfirmedLeave) {
      navigate(BrowserRoutes.ModelDetail + assetId);
    }
  };

  // upload new model or save changes to existing model
  const handleUploadOrSave = async () => {
    if (
      assetNameInput.length === 0 ||
      assetDescriptionInput.length === 0 ||
      filesInput.length === 0 ||
      tagsInput.filter((tag) => tag.isSelected).length === 0
    ) {
      await confirm(
        t('save.not_enough'),
        false,
        dispatch,
        undefined,
        undefined,
        <p>{t('save.requiered')}</p>
      );
      return;
    }

    // if assetId is defined, edit model, otherwise create new model
    if (assetId !== undefined) {
      await editModel({
        id: assetId,
        name: assetNameInput,
        description: assetDescriptionInput.trim(),
        author: authorNameInput,
        category: categoriesInput.find((category) => category.isSelected)?.id ?? 1,
        tags: tagsInput.filter((tag) => tag.isSelected).map((tag) => tag.id),
        files: filesInput.filter((file) => file.type === 'local'),
      });
      setRefreshModel((i) => i + 1);

      show({
        title: t('save.saved'),
        variant: 'success',
      });

    } else {
      const createdId = await createModel({
        name: assetNameInput,
        author: authorNameInput,
        description: assetDescriptionInput.trim(),
        category: categoriesInput.find((category) => category.isSelected)?.id ?? 1,
        tags: tagsInput.filter((tag) => tag.isSelected).map((tag) => tag.id),
        files: filesInput.filter((file) => file.type === 'local'),
      });
      // setRefreshModel((i) => i + 1);

      show({
        title: t('save.uploaded'),
        variant: 'success',
        actions: (
          <Button variant='light' onClick={() => navigate(BrowserRoutes.ModelManage + createdId)}>
            <FontAwesomeIcon icon={faPen} />
            <span className="w-full">{t('save.go_to_edit')}</span>
          </Button>
        )
      });
    }
  };

  if (isLoading || modelManageData === null) return <Preloader className="min-h-screen" />;

  const ActionButtons = (
    <>
      {assetId !== undefined && (
        <div className="w-1/2 p-1">
          <Link
            className="no-underline"
            onClick={handleShowPreview}
            to={BrowserRoutes.ModelDetail + assetId}
          >
            <Button variant="light" className="justify-between w-full">
              <FontAwesomeIcon icon={faEye} />
              <span className="w-full">Preview</span>
            </Button>
          </Link>
        </div>
      )}
      <div className="w-1/2 p-1">
        <Button
          variant="light"
          className="justify-between w-full"
          onClick={handleUploadOrSave}
        >
          <FontAwesomeIcon icon={assetId === undefined ? faUpload : faSave} />
          <span className="w-full">
            {assetId === undefined ? t('uploadButton') : t('saveButton')}
          </span>
        </Button>
      </div>
      {assetId !== undefined && (
        <div className="w-1/2 p-1">
          <Button
            variant="accent"
            className="justify-between w-full"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrash} />
            <span className="w-full">{t('deleteButton')}</span>
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        files={previewDetailFiles}
        bordered={true}
        buttons={ActionButtons}
      >
        <div className="relative mb-4 group">
          <Input
            type="text"
            className="w-full"
            inputClassName="text-xl font-medium tracking-wide"
            size={'xl'}
            maxLength={maxAssetNameLength}
            placeholder={t('asset_name')}
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
          <Input
            type="text"
            className="w-full"
            inputClassName="text-xl font-medium tracking-wide"
            size={'xl'}
            maxLength={maxAuthorNameLength}
            placeholder={t('author_name')}
            value={authorNameInput}
            onChange={(event) => {
              setAuthorNameInput(event.target.value.substring(0, maxAuthorNameLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {authorNameInput.length} / {maxAuthorNameLength}
          </p>
        </div>
        <div className="relative mb-4 group">
          <textarea
            className="w-full bg-bg-100 border border-ui-border rounded-lg p-4 h-50 resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-text-950 transition-all font-light"
            rows={8}
            maxLength={maxAssetDescriptionLength}
            placeholder={t('description')}
            value={assetDescriptionInput}
            onChange={(event) => {
              setAssetDescriptionInput(event.target.value.substring(0, maxAssetDescriptionLength));
            }}
          />
          <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
            {assetDescriptionInput.length} / {maxAssetDescriptionLength}
          </p>
        </div>

        <ModelInfoSection name={t('category')}>
          <CategorySelect categories={categoriesInput} setCategories={setCategoriesInput} isRadio={true} />
        </ModelInfoSection>

        <ModelInfoSection name={t('tags')} className="mt-6">
          <TagSelect tags={tagsInput} setTags={setTagsInput} />
        </ModelInfoSection>

        <ModelInfoSection name={t('files')} className="mt-6">
          <FileSelect files={filesInput} setFiles={setFilesInput} />
        </ModelInfoSection>
      </ModelDetailLayout>
    </>
  );
};

export default ModelManage;
