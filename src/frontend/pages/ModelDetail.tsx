import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Label } from '../../libs/ui/components';

const ModelDetail: React.FC = () => {
  const User = useSelector((state: RootState) => state.User);

  const Download = () => {};

  return (
    <ModelDetailLayout bordered={true}>
      <Label size="lg" className=" mt-1 kanit-regular lts-1">Model name</Label>
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
        <Label size="xxs" className="kanit-regular">Category</Label>
        <p>3D Model</p>
      </div>
      <div className="ms-3 mt-2 w-80 d-flex justify-content-between">
        <Label size="xxs" className="kanit-regular">Tags</Label>
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
      <Button
        onClick={
          User.isAuthenticated ? Download : undefined /*replace with link to oauth in the future*/
        }
        className="d-flex justify-content-center position-absolute ms-4 download"
      >
        Download
      </Button>
    </ModelDetailLayout>
  );
};

export default ModelDetail;
