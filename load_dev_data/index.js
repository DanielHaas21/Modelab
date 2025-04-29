import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';

const createFile = (path, isHidden, isMain) => {
    return {path, isHidden, isMain}
};

const createAsset = (name, description, categoryId, tagIds, filesDir, files) => {
    return {name, description, categoryId, tagIds, files: files.map((file) => { 
        return {
            ...file,
            path: filesDir + file.path
        }
    })};
};

const post = async (endpoint, data) => {
    try {
        const response = await axios.post(BASE_URL + endpoint, data);
        if('cause' in response.data) {
            console.error(response.data);
        }
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}

const load = async () => {
    console.log('Loading categories');
    for (let i = 0; i < categories.length; i++) {
        const name = categories[i];
        console.log('Loading category: ' + name);
        await post('/category/create', {name});
    }

    console.log('Loading tags');
    for (let i = 0; i < tags.length; i++) {
        const name = tags[i];
        console.log('Loading tag: ' + name);
        await post('/tag/create', {name});
    }

    console.log('Loading assets');
    for (let i = 0; i < assets.length; i++) {
        const {name, description, categoryId, tagIds, files} = assets[i];

        console.log('Loading asset: ' + name);
        const form = new FormData();

        form.append('name', name.substring(0, 128));
        form.append('description', description.substring(0, 320));
        form.append('categoryId', categoryId.toString());
        tagIds.forEach((tagId) => {
            form.append('tagIds[]', tagId.toString());
        });

        files.forEach(({path, isHidden, isMain}, index) => {
            form.append('filesMeta[' + index.toString() + '][isHidden]', isHidden ? '1' : '0');
            form.append('filesMeta[' + index.toString() + '][isMain]', isMain ? '1' : '0');
            form.append('files[]', fs.createReadStream(path));
        });

        try {
            const response = await axios.post(BASE_URL + '/asset/create', form, {
                headers: {
                    ...form.getHeaders(), // Important: set correct Content-Type with boundary
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            if('cause' in response.data) {
                console.error(response.data);
            }
        } catch (error) {
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
        createFile('Chram.mb', false, false),
        createFile('Chram_export.mb', false, false),
        createFile('chram.fbx', false, true),
        createFile('Chram_All.png', false, true),
        createFile('Chram_Persp.png', false, true),
    ]),
    createAsset('Baudys', lorem, ModelCateg, [MayaTag, ShrineTag], `${dirname}/files/Baudys/`, [
        createFile('Baudys.mb', false, false),
        createFile('all.png', false, true),
        createFile('persp.png', false, true),
    ]),
    createAsset('Bugaj', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag, TexturedTag], `${dirname}/files/Bugaj/`, [
        createFile('Bugaj.mb', false, false),
        createFile('Bugaj.fbx', false, true),
        createFile('all.png', false, false),
        createFile('persp.png', false, false),
    ]),
    createAsset('CP_NabytekHraoTruny', lorem, ModelCateg, [MayaTag, OBJTag, PropTag], `${dirname}/files/CP_NabytekHraoTruny/`, [
        createFile('CP_NabytekHraoTruny.mb', false, false),
        createFile('CP_NabytekHraoTruny.mtl', false, true),
        createFile('CP_NabytekHraoTruny.obj', false, true),
    ]),
    createAsset('Sedmihradsky', lorem, ModelCateg, [MayaTag, OBJTag, ShrineTag], `${dirname}/files/Sedmihradsky/`, [
        createFile('Sedmihradsky.mb', false, false),
        createFile('Sedmihradsky.obj', false, true),
        createFile('Sedmihradsky.mtl', false, true),
        createFile('all.png', false, false),
        createFile('persp.png', false, false),
    ]),
    createAsset('Stastka', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag], `${dirname}/files/Stastka/`, [
        createFile('Stastka.mb', false, false),
        createFile('Stastka.fbx', false, true),
        createFile('all.png', false, false),
        createFile('persp.png', false, false),
    ]),
    createAsset('Tumova_TajMahal', lorem, ModelCateg, [MayaTag, FBXTag, ShrineTag], `${dirname}/files/Tumova_TajMahal/`, [
        createFile('Tumova_TajMahal.mb', false, false),
        createFile('Tumova_TajMahal.fbx', false, true),
        createFile('all.png', false, false),
        createFile('persp.png', false, false),
    ]),
];

load();