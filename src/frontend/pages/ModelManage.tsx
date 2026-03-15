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
  }, [assetId]);

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

    const userConfirmed = await confirm(
      'Unsaved changes!',
      true,
      dispatch,
      undefined,
      undefined,
      <p>Are you sure you want to leave?</p>
    );

    if (userConfirmed) {
      navigate(BrowserRoutes.ModelDetail + assetId);
    }

  };

  const handleUploadOrSave = async () => {
    // if (
    //   assetNameInput.length === 0 ||
    //   assetDescriptionInput.length === 0 ||
    //   filesInput.length === 0 ||
    //   tagsInput.filter((tag) => tag.isSelected).length === 0
    // ) {
    //   await confirm(
    //     'Not enough data!',
    //     false,
    //     dispatch,
    //     undefined,
    //     undefined,
    //     <p>name, description, files, and a tag is requiered</p>
    //   );

    //   return;
    // }

    // if (action === 'upload') {
    //   await createModel({
    //     name: assetName,
    //     desc: assetDescription,
    //     category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
    //     tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
    //     files: files.filter((file) => file.file !== undefined),
    //   });
    //   setRefresh((prev) => prev + 1);
    // } else {
    //   await editModel({
    //     id: asset!.id,
    //     name: assetName,
    //     desc: assetDescription,
    //     category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
    //     tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
    //     files: files.filter((file) => file.file !== undefined),
    //   });
    //   setInitialChanges({
    //     name: assetName,
    //     description: assetDescription,
    //     category: categories.find((cat) => cat.isSelected) ?? categories[0],
    //     tags: tags.filter((tag) => tag.isSelected),
    //     files: files,
    //   });
    //   dispatch(Add({
    //     message: 'Saved!',
    //     variant: 'Success'
    //   }))
    // }
  };

  if (isLoading) return <Preloader className="min-h-screen" />;

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        files={previewDetailFiles}
        bordered={true}
        goBack={false}
        previewButtonId={assetId}
        previewButtonOnCLick={handleShowPreview}
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
            className="w-full bg-bg-100 border border-ui-border rounded-lg p-4 h-50 resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-text-950 transition-all kanit-light"
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

  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

  // const [refresh, setRefresh] = React.useState<number>(0);
  // const [initialChanges, setInitialChanges] = React.useState<EditChanges | null>(null);

  // const uploadAction = 'upload';
  // const maxAssetNameLength = 128;
  // const maxAssetDescriptionLength = 320;

  // const categoryApi = new Category();
  // const tagApi = new Tag();
  // const assetApi = new Asset();

  // const [asset, setAsset] = React.useState<AssetData | null>(null);
  // const [isLoadingAsset, setIsLoadingAsset] = React.useState<boolean>(action != uploadAction);
  // const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  // const [tags, setTags] = React.useState<TagOption[]>([]);
  // const [assetName, setAssetName] = React.useState<string>('');
  // const [assetDescription, setAssetDescription] = React.useState<string>('');
  // const [files, setFiles] = React.useState<FileOption[]>([]);

  // React.useEffect(() => {
  //   setAsset(null);
  //   setAssetName('');
  //   setAssetDescription('');
  //   setTags(
  //     tags.map((tag) => ({
  //       ...tag,
  //       isSelected: false,
  //     }))
  //   );
  //   setFiles([]);
  // }, [action, refresh]);

  // React.useEffect(() => {
  //   const loadCategories = async (asset: AssetData | null) => {
  //     try {
  //       const { categories } = await categoryApi.getAll();
  //       setCategories(
  //         categories.map((category) => ({
  //           id: category.id,
  //           name: category.name,
  //           isSelected: category.id == asset?.category.id,
  //         }))
  //       );
  //     } catch (err) {
  //       if (err instanceof ApiError) {
  //         console.error('Failed to fetch categories', err);
  //       } else {
  //         throw err;
  //       }
  //     }
  //   };

  //   const loadTags = async (asset: AssetData | null) => {
  //     try {
  //       const { tags } = await tagApi.getAll();
  //       setTags(
  //         tags.map((tag) => ({
  //           id: tag.id,
  //           name: tag.name,
  //           isSelected: asset?.tags.find((assetTag) => tag.id == assetTag.id) !== undefined,
  //         }))
  //       );
  //     } catch (err) {
  //       if (err instanceof ApiError) {
  //         console.error('Failed to fetch tags', err);
  //       } else {
  //         throw err;
  //       }
  //     }
  //   };

  //   const fetchAsset = async (id: number) => {
  //     try {
  //       const data = await assetApi.get(id);
  //       return data.asset;
  //     } catch (err) {
  //       if (err instanceof ApiError) {
  //         console.error('Failed to fetch assets', err);
  //       } else {
  //         throw err;
  //       }
  //     }
  //   };

  //   const fetchAssetFiles = async (id: number) => {
  //     try {
  //       const data = await assetApi.getFiles(id);
  //       return data.files;
  //     } catch (err) {
  //       if (err instanceof ApiError) {
  //         console.error('Failed to fetch asset files', err);
  //       } else {
  //         throw err;
  //       }
  //     }
  //   };

  //   const loadAsset = async () => {
  //     setIsLoadingAsset(true);

  //     const asset = (await fetchAsset(assetId)) ?? null;
  //     setAsset(asset);

  //     setAssetName(asset?.name ?? '');
  //     setAssetDescription(asset?.description ?? '');

  //     const assetFiles = (await fetchAssetFiles(assetId)) ?? [];
  //     setFiles(
  //       assetFiles.map((file) => ({
  //         ...file,
  //       }))
  //     );

  //     setIsLoadingAsset(false);

  //     return asset;
  //   };

  //   const load = async () => {
  //     let asset: AssetData | null = null;
  //     if (action != uploadAction) asset = await loadAsset();
  //     await loadCategories(asset);
  //     await loadTags(asset);
  //   };

  //   load();
  // }, []);

  // React.useEffect(() => {
  //   if (categories.length === 0 || tags.length === 0) return;
  //   if (initialChanges !== null) return; // if already set do not overrride

  //   setInitialChanges({
  //     name: assetName,
  //     description: assetDescription,
  //     category: categories.find((cat) => cat.isSelected) ?? categories[0],
  //     tags: tags.filter((tag) => tag.isSelected),
  //     files: files,
  //   });
  // }, [assetName, assetDescription, categories, tags, files]);

  // const CheckChange = async (event: React.MouseEvent<HTMLAnchorElement>) => {
  //   event.preventDefault();

  //   if (
  //     assetName !== initialChanges?.name ||
  //     assetDescription !== initialChanges.description ||
  //     !compareObjects(
  //       categories.find((cat) => cat.isSelected) ?? categories[0],
  //       initialChanges.category
  //     ) ||
  //     !compareObjects(
  //       tags.filter((tag) => tag.isSelected),
  //       initialChanges.tags
  //     ) ||
  //     !compareObjects(files, initialChanges.files)
  //   ) {
  //     const userConfirmed = await confirm(
  //       'Unsaved changes!',
  //       true,
  //       dispatch,
  //       undefined,
  //       undefined,
  //       <p>Are you sure you want to leave?</p>
  //     );

  //     if (userConfirmed) {
  //       navigate(BrowserRoutes.ModelDetail + asset?.id);
  //     } else {
  //       return;
  //     }
  //   } else {
  //     navigate(BrowserRoutes.ModelDetail + asset?.id);
  //   }
  // };

  // const uploadSave = async () => {
  //   if (
  //     assetName == '' ||
  //     assetDescription == '' ||
  //     files.length == 0 ||
  //     tags.filter((tag) => tag.isSelected == true).length == 0
  //   ) {
  //     await confirm(
  //       'Not enough data!',
  //       false,
  //       dispatch,
  //       undefined,
  //       undefined,
  //       <p>name, description, files, and a tag is requiered</p>
  //     );

  //     return;
  //   }

  //   if (action === 'upload') {
  //     await createModel({
  //       name: assetName,
  //       desc: assetDescription,
  //       category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
  //       tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
  //       files: files.filter((file) => file.file !== undefined),
  //     });
  //     setRefresh((prev) => prev + 1);
  //   } else {
  //     await editModel({
  //       id: asset!.id,
  //       name: assetName,
  //       desc: assetDescription,
  //       category: categories.find((cat) => cat.isSelected == true)?.id ?? 1,
  //       tags: tags.filter((tag) => tag.isSelected == true).map((tag) => tag.id),
  //       files: files.filter((file) => file.file !== undefined),
  //     });
  //     setInitialChanges({
  //       name: assetName,
  //       description: assetDescription,
  //       category: categories.find((cat) => cat.isSelected) ?? categories[0],
  //       tags: tags.filter((tag) => tag.isSelected),
  //       files: files,
  //     });
  //     dispatch(Add({
  //       message: 'Saved!',
  //       variant: 'Success'
  //     }))
  //   }
  // };
  // if (isLoadingAsset) return <Preloader className="min-h-screen" />;

  // const fileProps: ModelFileProp[] = [];
  // for (const file of files) {
  //   console.log(file);
  //   // TODO: Implement manage files
  //   // fileProps.push();
  // }

  // return (
  //   <>
  //     <GeneralPopup />
  //     <ModelDetailLayout
  //       files={fileProps}
  //       bordered={true}
  //       goBack={false}
  //       previewButtonId={asset?.id}
  //       previewButtonOnCLick={CheckChange}
  //       uploadSaveButton={{
  //         type: asset?.id ? 'save' : 'upload',
  //         onClick: uploadSave,
  //       }}
  //     >
  //       <div className="relative mb-4 group">
  //         <Input
  //           type="text"
  //           className="w-full"
  //           inputClassName="text-xl font-medium tracking-wide"
  //           size={'xl'}
  //           maxLength={maxAssetNameLength}
  //           placeholder="Asset name"
  //           value={assetName}
  //           onChange={(event) => {
  //             setAssetName(event.target.value.substring(0, maxAssetNameLength));
  //           }}
  //         />
  //         <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
  //           {assetName.length} / {maxAssetNameLength}
  //         </p>
  //       </div>

  //       <div className="relative mb-4 group">
  //         <textarea
  //           className="w-full bg-bg-100 border border-ui-border rounded-lg p-4 h-[200px] resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-text-950 transition-all kanit-light"
  //           rows={8}
  //           maxLength={maxAssetDescriptionLength}
  //           placeholder="Asset description"
  //           value={assetDescription}
  //           onChange={(event) => {
  //             setAssetDescription(event.target.value.substring(0, maxAssetDescriptionLength));
  //           }}
  //         />
  //         <p className="absolute right-3 bottom-2 text-xs opacity-40 group-focus-within:opacity-100 transition-opacity">
  //           {assetDescription.length} / {maxAssetDescriptionLength}
  //         </p>
  //       </div>

  //       <ModelInfoSection name="Category">
  //         <CategorySelect categories={categories} setCategories={setCategories} isRadio={true} />
  //       </ModelInfoSection>

  //       <ModelInfoSection name="Tags" className="mt-6">
  //         <TagSelect tags={tags} setTags={setTags} />
  //       </ModelInfoSection>

  //       <ModelInfoSection name="Files" className="mt-6 pb-10">
  //         <FileSelect files={files} setFiles={setFiles} />
  //       </ModelInfoSection>
  //     </ModelDetailLayout>
  //   </>
  // );
};

export default ModelManage;
