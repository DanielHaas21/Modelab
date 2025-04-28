import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Label, Preloader } from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import test from '../../libs/ui/assets/example_model.fbx';
import testpng from '../../libs/ui/assets/train_uhd.png';
import { File } from '../../middleware/api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { Add } from '../../store/slices/Message';
import { ModelData } from '../../middleware/actions/LoadModelDetail';
import { useNavigate } from 'react-router-dom';
import LoadModelDetail from '../../middleware/actions/LoadModelDetail';
import axios from 'axios';

const ModelDetail: React.FC = () => {
  const [modelData, setModelData] = React.useState<ModelData | null>(null);
  const User = useSelector((state: RootState) => state.User);
  const Dispatch = useDispatch<AppDispatch>();
  const model = useParams();
  const Download = () => {};

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const ModelData = await LoadModelDetail(parseInt(model.modelId!));
        console.log(ModelData);
        console.log(test)
        setModelData(ModelData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    };

    fetchData();
  }, [0]); 

  if (!modelData) return <Preloader />;

  console.log(modelData.Files)
  return (
    <ModelDetailLayout bordered={true} image={modelData!.Files[0]}>
      <Label size="lg" className="kanit-regular lts-1">
        {modelData?.name}
      </Label>
      <p className="ms-3 mt-4 kanit-light w-80 overflow-auto max-h-20-vh">{modelData?.desc}</p>
      <div className="ms-3 mt-2 d-flex align-items-center">
        <Label size="xxs" className="kanit-regular w-50">
          Category
        </Label>
        <p className="m-0 w-50" key={modelData.category.id}>
          {modelData.category.name}
        </p>
      </div>
      <div className="ms-3 mt-2 d-flex justify-content-between">
        <Label size="xxs" className="kanit-regular">
          Tags
        </Label>
        <div className="d-flex justify-content-start flex-wrap flex-row w-50">
          {modelData.tags?.map((tag) => <AssetTag key={tag.id} name={tag.name}></AssetTag>)}
        </div>
      </div>
      <div className="sticky-bottom mt-4 ms-4 pb-4">
        <Button
          onClick={
            User.isAuthenticated ? Download : undefined /*replace with link to oauth in the future*/
          }
          className="d-flex justify-content-center mt-6 download"
        >
          Download
        </Button>
      </div>
    </ModelDetailLayout>
  );
};

export default ModelDetail;
