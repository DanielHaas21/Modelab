import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link } from 'react-router-dom';

const ModelDetail: React.FC = () => {
  return (
    <ModelDetailLayout bordered={true}>
      <h2 className="fs-7 mt-1 kanit-regular lts-1">Model name</h2>
      <p className="ms-3 mt-4 kanit-light w-80">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce tellus. Etiam dui sem,
        fermentum vitae, sagittis id, malesuada in, quam. Suspendisse sagittis ultrices augue.
        Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Suspendisse
        sagittis ultrices augue. Vivamus porttitor turpis ac leo. Integer malesuada. Nullam eget
        nisl. Nullam justo enim, consectetuer nec, ullamcorper ac, vestibulum in, elit. Proin in
        tellus sit amet nibh dignissim sagittis. Nam sed tellus id magna elementum tincidunt.
        Pellentesque ipsum. Ut tempus purus at lorem. Maecenas aliquet accumsan leo.
      </p>
      <div className="ms-3 mt-2 w-50 d-flex justify-content-between">
        <h3 className="fs-3 kanit-regular">Category</h3>
        <p>3D Model</p>
      </div>
      <div className="ms-3 mt-2 w-80 d-flex justify-content-between">
        <h3 className="fs-3 kanit-regular">Tags</h3>
        <div className="d-flex justify-content-start flex-wrap flex-row w-50">
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
          <span className="model-tag rounded-2 px-1 pr-1">tag</span>
        </div>
      </div>
      <Button className="d-flex justify-content-center position-absolute ms-4 download">
        Download
      </Button>
    </ModelDetailLayout>
  );
};

export default ModelDetail;
