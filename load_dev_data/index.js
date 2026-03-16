import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';

const createFile = (path, isHidden, isMain, isPreview) => {
  return { path, isHidden, isMain, isPreview }
};

const createAsset = (name, description, categoryId, tagIds, filesDir, files) => {
  return {
    name, description, categoryId, tagIds, files: files.map((file) => {
      return {
        ...file,
        path: filesDir + file.path
      }
    })
  };
};

const post = async (endpoint, data, token = undefined) => {
  try {
    const config = token === undefined ? undefined : {
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    const response = await axios.post(BASE_URL + endpoint, data, config);
    if ('cause' in response.data) {
      console.error(response.data);
    }
    return response;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
}

const login = async () => {
  console.log('Logging in with: ' + LOGIN_TOKEN);
  const response = await post('/user/login', { accessToken: LOGIN_TOKEN });
  if (response === null) return;
  const { token } = response.data;
  console.log('Logged in. Token: ' + token);
  return token;
};

const load = async (token) => {
  console.log('Loading categories');
  for (let i = 0; i < categories.length; i++) {
    const name = categories[i];
    console.log('Loading category: ' + name);
    await post('/category/create', { name }, token);
  }

  console.log('Loading tags');
  for (let i = 0; i < tags.length; i++) {
    const name = tags[i];
    console.log('Loading tag: ' + name);
    await post('/tag/create', { name }, token);
  }

  console.log('Loading assets');
  for (let i = 0; i < assets.length; i++) {
    const { name, description, categoryId, tagIds, files } = assets[i];

    const form = new FormData();

    form.append('name', name.substring(0, 128));
    form.append('description', description.substring(0, 320));
    form.append('author', 'Skibidak');
    form.append('categoryId', categoryId.toString());
    tagIds.forEach((tagId) => {
      form.append('tagIds[]', tagId.toString());
    });

    files.forEach(({ path, isHidden, isMain, isPreview }, index) => {
      form.append('filesMeta[' + index.toString() + '][isHidden]', isHidden ? '1' : '0');
      form.append('filesMeta[' + index.toString() + '][isMain]', isMain ? '1' : '0');
      form.append('filesMeta[' + index.toString() + '][isPreview]', isPreview ? '1' : '0');
      form.append('files[]', fs.createReadStream(path));
    });

    try {
      const response = await axios.post(BASE_URL + '/asset/create', form, {
        headers: {
          Authorization: 'Bearer ' + token,
          ...form.getHeaders(), // Important: set correct Content-Type with boundary
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      if ('cause' in response.data) {
        console.log('Failed loading asset: ' + name);
        console.error(response.data);
      } else {
        console.log('Loaded asset: ' + name + ' with id: ' + response.data.id);
      }
    } catch (error) {
      console.log('Failed loading asset: ' + name);
      console.error(error.response?.data || error.message);
    }
  }
};

const lorem = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce tellus. Etiam dui sem, 
fermentum vitae, sagittis id, malesuada in, quam. Suspendisse sagittis ultrices augue.
Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Suspendisse
sagittis ultrices augue. Vivamus porttitor turpis ac leo. Integer malesuada. Nullam eget
nisl. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Proin in
tellus sit amet nibh dignissim sagittis.`;

const BASE_URL = 'http://localhost/Modelab-api';
const LOGIN_TOKEN = 'dev_token';

const dirname = import.meta.dirname;

const categories = ['3D Models', '2D Textures', 'Audio'];

const ModelCateg = 1;

const tags = ['Maya', 'FBX', 'OBJ', 'Prop', 'Shrine', 'Textured'];

const MayaTag = 1;
const FBXTag = 2;
const OBJTag = 3;
const PropTag = 4;
const ShrineTag = 5;
const TexturedTag = 6;

const assets = [
  createAsset('Chram', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag], `${dirname}/files/Chram/`, [
    createFile('Chram.mb', false, false, false),
    createFile('Chram_export.mb', false, false, false),
    createFile('chram.fbx', false, true, false),
    createFile('Chram_All.png', false, true, false),
    createFile('Chram_Persp.png', false, true, true),
  ]),
  createAsset('Baudys', lorem, ModelCateg, [MayaTag, ShrineTag], `${dirname}/files/Baudys/`, [
    createFile('Baudys.mb', false, false, false),
    createFile('all.png', false, true, false),
    createFile('persp.png', false, true, true),
  ]),
  createAsset('Bugaj', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag, TexturedTag], `${dirname}/files/Bugaj/`, [
    createFile('Bugaj.mb', false, false, false),
    createFile('Bugaj.fbx', false, true, false),
    createFile('all.png', false, false, false),
    createFile('persp.png', false, false, true),
  ]),
  createAsset('CP_NabytekHraoTruny', lorem, ModelCateg, [MayaTag, OBJTag, PropTag], `${dirname}/files/CP_NabytekHraoTruny/`, [
    createFile('CP_NabytekHraoTruny.mb', false, false, false),
    createFile('CP_NabytekHraoTruny.mtl', false, true, false),
    createFile('CP_NabytekHraoTruny.obj', false, true, false),
  ]),
  createAsset('Sedmihradsky', lorem, ModelCateg, [MayaTag, OBJTag, ShrineTag], `${dirname}/files/Sedmihradsky/`, [
    createFile('Sedmihradsky.mb', false, false, false),
    createFile('Sedmihradsky.obj', false, true, false),
    createFile('Sedmihradsky.mtl', false, true, false),
    createFile('all.png', false, false, false),
    createFile('persp.png', false, false, true),
  ]),
  createAsset('Stastka', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag], `${dirname}/files/Stastka/`, [
    createFile('Stastka.mb', false, false, false),
    createFile('Stastka.fbx', false, true, false),
    createFile('all.png', false, false, false),
    createFile('persp.png', false, false, true),
  ]),
  createAsset('Tumova_TajMahal', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag], `${dirname}/files/Tumova_TajMahal/`, [
    createFile('Tumova_TajMahal.mb', false, false, false),
    createFile('Tumova_TajMahal.fbx', false, true, false),
    createFile('all.png', false, false, false),
    createFile('persp.png', false, false, true),
  ]),
];

(async () => {
  const token = await login();
  await load(token);
})();