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
import { ROOT_ROUTES } from '../../global/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faSave, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useValidatePermission } from '../../libs/auth';
import { CLEARANCE } from '../../store/types';
import { useTitle, useToast, useTranslation } from '../../libs/hooks';
import { AssetFile, ManageFile, ModelManageContext } from '../../middleware/types/actions';
import { loadModelManageContext } from '../../middleware/actions/loadModelManageContext';
import { loadAssetFiles } from '../../middleware/actions/loadAssetFiles';

const ModelManage: React.FC = () => {
  const maxAssetNameLength = 128;
  const maxAuthorNameLength = 128;
  const maxAssetDescriptionLength = 320;

  const t = useTranslation("pages.model_manage");

  const { action } = useParams();
  const { show } = useToast();

  const assetId = isFinite(Number(action)) ? Number(action) : undefined;

  useValidatePermission(CLEARANCE.ADMIN, assetId !== undefined ? (ROOT_ROUTES.ModelDetail + assetId) : ROOT_ROUTES.Browser);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [refreshModel, setRefreshModel] = React.useState<number>(0);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modelManageContext, setModelManageContext] = React.useState<ModelManageContext | null>(null);

  const [title, setTitle] = React.useState<string>('Loading...');
  useTitle({ type: 'name', name: title });

  const [assetNameInput, setAssetNameInput] = React.useState<string>('');
  const [authorNameInput, setAuthorNameInput] = React.useState<string>('');
  const [assetDescriptionInput, setAssetDescriptionInput] = React.useState<string>('');
  const [categoriesInput, setCategoriesInput] = React.useState<CategoryOption[]>([]);
  const [tagsInput, setTagsInput] = React.useState<TagOption[]>([]);
  const [filesInput, setFilesInput] = React.useState<ManageFile[]>([]);

  const [previewDetailFiles, setPreviewDetailFiles] = React.useState<AssetFile[]>([]);

  // load context
  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const context = await loadModelManageContext(assetId ?? null);
        setModelManageContext(context);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
      setIsLoading(false);
    })();
  }, [assetId, refreshModel]);

  // setup data
  React.useEffect(() => {
    if (!modelManageContext) return;

    const asset = modelManageContext.asset;
    const config = modelManageContext.config;
    const tagIds = asset?.tags.map(t => t.id) ?? [];

    if (asset === null) {
      setTitle('Upload');
    } else {
      setTitle(`Manage ${asset.name}`);
    }

    setCategoriesInput(config.allCategories.map(category => ({
      ...category,
      isSelected: category.id === asset?.category.id
    })) ?? []);

    setTagsInput(config.allTags.map(tag => ({
      ...tag,
      isSelected: tagIds.includes(tag.id)
    })) ?? []);

    setFilesInput(asset?.files ?? []);

    setAssetNameInput(asset?.name ?? '');
    setAuthorNameInput(asset?.author ?? '');
    setAssetDescriptionInput(asset?.description ?? '');
  }, [modelManageContext]);

  // uploaded files added to preview
  React.useEffect(() => {
    if (!modelManageContext) return;
    (async () => {
      const assetFiles = await loadAssetFiles(filesInput.filter((file) => !file.isRemoved && !file.isHidden));
      setPreviewDetailFiles(assetFiles);
    })();
  }, [filesInput, modelManageContext]);

  // delete model and return to browser
  const handleDelete = async () => {
    if (assetId === undefined) return;
    const userConfirmedNo = await confirm(
      t('confirm.delete'),
      true,
      dispatch,
      t('confirm.no'),
      t('confirm.yes'),
      <p>{t("confirm.sure_delete")}<span className='text-2xl'>`{modelManageContext?.asset?.name ?? assetNameInput}`</span>?<br /><b>{t("confirm.cant_undo")}</b></p>
    );

    if (userConfirmedNo) return;
    await modelManageContext?.delete({
      id: assetId
    });
    navigate(ROOT_ROUTES.Browser);
  };

  // check if there are unsaved changes and show preview
  // preview is a read only page, that looks the same as model detail page, but with the current input data instead of the original model data
  const handleShowPreview = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // check if there are unsaved changes
    if (modelManageContext === null || modelManageContext.asset === null) return;
    const asset = modelManageContext.asset;

    // check if there are changes in name, description, category, tags or files
    // There musnt be any change for the user to be able to see the preview without confirmation, even if there are changes in files
    // The user must confirm, because the preview files are generated from the current files input, and if there are changes in files, the preview might look different than the model detail page, which can be confusing for the user
    const selectedCategory = categoriesInput.find((category) => category.isSelected);
    const selectedTags = tagsInput.filter(tag => tag.isSelected);

    if (assetNameInput === asset.name
      && authorNameInput === asset.author
      && assetDescriptionInput === asset.description
      && selectedCategory?.id === asset.category.id
      && selectedTags.length === asset.tags.length
      && selectedTags.every((tag) => asset.tags.find((modelTag) => tag.id === modelTag.id) !== undefined)
      && filesInput.length === asset.files.length
      && filesInput.every((file) =>
        file.type === 'fetched'
        && asset.files.find((modelFile) =>
          modelFile.type === 'fetched'
          && file.fetchedFile.id === modelFile.fetchedFile.id
        ) !== undefined
      )
    ) {
      navigate(ROOT_ROUTES.ModelDetail + assetId);
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
      navigate(ROOT_ROUTES.ModelDetail + assetId);
    }
  };

  // upload new model or save changes to existing model
  const handleUploadOrSave = async () => {
    if (modelManageContext === null) return;
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
      await modelManageContext.edit({
        id: assetId,
        name: assetNameInput,
        description: assetDescriptionInput.trim(),
        author: authorNameInput,
        category: categoriesInput.find((category) => category.isSelected)!,
        tags: tagsInput.filter((tag) => tag.isSelected),
        files: filesInput,
      });
      setRefreshModel((i) => i + 1);

      show({
        title: t('save.saved'),
        variant: 'success',
      });

    } else {
      const created = await modelManageContext.create({
        name: assetNameInput,
        author: authorNameInput,
        description: assetDescriptionInput.trim(),
        category: categoriesInput.find((category) => category.isSelected)!,
        tags: tagsInput.filter((tag) => tag.isSelected),
        files: filesInput.filter((file) => file.type === 'local'),
      });
      // setRefreshModel((i) => i + 1);

      show({
        title: t('save.uploaded'),
        variant: 'success',
        actions: (
          <Button variant='light' onClick={() => navigate(ROOT_ROUTES.ModelManage + created.createdAssetId)}>
            <FontAwesomeIcon icon={faPen} />
            <span className="w-full">{t('save.go_to_edit')}</span>
          </Button>
        )
      });
    }
  };

  if (isLoading || modelManageContext === null) return <Preloader className="min-h-screen" />;

  const ActionButtons = (
    <>
      {assetId !== undefined && (
        <div className="w-1/2 p-1">
          <Link
            className="no-underline"
            onClick={handleShowPreview}
            to={ROOT_ROUTES.ModelDetail + assetId}
          >
            <Button variant="light" className="justify-between w-full">
              <FontAwesomeIcon icon={faEye} />
              <span className="w-full">{t('previewButton')}</span>
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
