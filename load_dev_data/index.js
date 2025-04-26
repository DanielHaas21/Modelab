import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';

const createFile = (path, isHidden) => {
    return {path, isHidden}
};

const createAsset = (name, description, categoryId, tagIds, files) => {
    return {name, description, categoryId, tagIds, files};
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

        files.forEach(({path, isHidden}, index) => {
            form.append('filesMeta[' + index.toString() + '][isHidden]', isHidden ? '1' : '0');
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
tellus sit amet nibh dignissim sagittis. Nam sed tellus id magna elementum tincidunt.
Pellentesque ipsum. Ut tempus purus at lorem. Maecenas aliquet accumsan leo.`;

const BASE_URL = 'http://localhost/Modelab-api';

const dirname = import.meta.dirname;

const categories = ['3D Models', '2D Textures', 'Audio'];
const tags = ['Unity', 'Maya', 'Cinema4D', 'Blender', 'FBX', 'OBJ', 'STL', 'Prop', 'Medieval', 'Skybox'];

const assets = [
    createAsset('Chram', lorem, 1, [2, 5, 9], [
        createFile(`${dirname}/files/Chram/Chram.mb`, false),
        createFile(`${dirname}/files/Chram/Chram_export.mb`, false),
        createFile(`${dirname}/files/Chram/chram.fbx`, false),
        createFile(`${dirname}/files/Chram/Chram_All.png`, false),
        createFile(`${dirname}/files/Chram/Chram_Persp.png`, false),
    ]),
];

load();