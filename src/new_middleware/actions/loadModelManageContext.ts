import { AssetFile, ManageCreateAssetQuery, ManageCreateAssetResponse, ManageDeleteAssetQuery, ManageDeleteAssetResponse, ManageEditAssetQuery, ManageEditAssetResponse, ManageFile, ModelManageContext } from '../types/actions';
import { ASSET, CATEGORY, FILE, TAG } from '../services';
import { getFileGroup } from '../../libs/utils';
import { load3DModel } from './loadModel';
import { AssetUpdateFile, FetchedAssetUpdateFile, LocalAssetUpdateFile } from '../types/services';

const createAsset = async (query: ManageCreateAssetQuery): Promise<ManageCreateAssetResponse> => {
  const createdAssetId = (await ASSET.create({
    author: query.author,
    name: query.name,
    description: query.description,
    categoryId: query.category.id,
    tagIds: query.tags.map((tag) => tag.id),
    files: query.files.map((file) => {
      return {
        ...file,
        file: file.localFile,
      }
    }),
  })).id;

  return {
    createdAssetId: createdAssetId,
  };
};

const editAsset = async (query: ManageEditAssetQuery): Promise<ManageEditAssetResponse> => {
  const updateFiles: AssetUpdateFile[] = [];
  for (const manageFile of query.files) {
    let updateFile: AssetUpdateFile | null = null;

    switch (manageFile.type) {
      case 'fetched': {
        const file: FetchedAssetUpdateFile = {
          ...manageFile,
          type: 'fetched',
          id: manageFile.fetchedFile.id,
        };
        updateFile = file;
        break;
      }
      case 'local': {
        const file: LocalAssetUpdateFile = {
          ...manageFile,
          type: 'local',
          file: manageFile.localFile,
        }
        updateFile = file;
        break;
      }
    }

    if (updateFile === null) continue;
    updateFiles.push(updateFile);
  }

  const editedAssetId = (await ASSET.update({
    id: query.id,
    author: query.author,
    name: query.name,
    description: query.description,
    categoryId: query.category.id,
    tagIds: query.tags.map((tag) => tag.id),
    files: updateFiles,
  })).id;

  return {
    editedAssetId: editedAssetId,
  };
};

const deleteAsset = async (query: ManageDeleteAssetQuery): Promise<ManageDeleteAssetResponse> => {
  const deletedAssetId = (await ASSET.delete({
    id: query.id
  })).id;

  return {
    deletedAssetId: deletedAssetId,
  };
};

export const loadModelManageContext = async (id: number | null): Promise<ModelManageContext> => {
  const categories = (await CATEGORY.getAll()).categories;
  const tags = (await TAG.getAll()).tags;
  const supportedFileTypes = (await FILE.getSupportedFileTypes()).supportedFileTypes;

  const contextBase: Omit<ModelManageContext, 'asset'> = {
    create: createAsset,
    edit: editAsset,
    delete: deleteAsset,
    config: {
      allCategories: categories,
      allTags: tags,
    }
  };

  if (id === null) {
    return {
      ...contextBase,
      asset: null,
    };
  }

  const asset = (await ASSET.get({ id: id })).asset;
  const fileMetas = (await ASSET.getFiles({ id: id })).files;

  const files: ManageFile[] = [];
  for (const fileMeta of fileMetas) {
    let assetFile: AssetFile | null = null;

    const fileBase = {
      ...fileMeta,
      download: async () => await FILE.get({ id: fileMeta.id }),
      previewUrl: FILE.getPreviewUrl({ id: fileMeta.id }),
    };

    const group = getFileGroup(fileMeta.fileType, supportedFileTypes);
    switch (group) {
      case 'image': {
        try {
          const imageBlob = await FILE.get({ id: fileMeta.id });
          const imageUrl = URL.createObjectURL(imageBlob);

          assetFile = {
            ...fileBase,
            type: 'image',
            imageUrl,
          };
        } catch (error) {
          console.error('Image download failed.', fileMeta, error);
        }
        break;
      }
      case 'model': {
        const model = await load3DModel(fileMeta);

        if (model === null)
          break; // skip

        assetFile = {
          ...fileBase,
          type: '3d',
          model,
        };
        break;
      }
      case 'audio': {
        try {
          const audioBlob = await FILE.get({ id: fileMeta.id });
          const audioUrl = URL.createObjectURL(audioBlob);

          assetFile = {
            ...fileBase,
            type: 'audio',
            audioUrl,
          };
        } catch (error) {
          console.error('Audio download failed.', fileMeta, error);
        }
        break;
      }
      case 'other': {
        assetFile = {
          ...fileBase,
          type: 'other',
        };
        break;
      }
      default:
        console.error('Unsuported file: ' + fileMeta.name + '.  Ignoring.');
        break;
    }

    if (assetFile === null) continue;

    files.push({
      ...fileMeta,
      type: 'fetched',
      fetchedFile: assetFile,
      isRemoved: false,
    });
  }

  return {
    ...contextBase,
    asset: {
      id: asset.id,
      author: asset.author,
      name: asset.name,
      description: asset.description,
      category: asset.category,
      tags: asset.tags,
      created: asset.created,
      updated: asset.updated,
      files,
    },
  }
};