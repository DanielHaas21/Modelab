import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Label, ModelInfoSection, Preloader } from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import { ModelData } from '../../middleware/types';
import LoadModelDetail from '../../middleware/actions/LoadModelDetail';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { Add } from '../../store/slices/Message';

const ModelDetail: React.FC = () => {
  const [modelData, setModelData] = React.useState<ModelData | null>(null);
  const model = useParams();
  const User = useSelector((state: RootState) => state.User);
  const Dispatch = useDispatch<AppDispatch>();

  const Download = (data: string, type: string) => {
    const blob = new Blob([data], { type: type });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = data;
    link.download = 'task';

    link.click();
    Dispatch(Add({ variant: 'Success', message: 'Asset saved successfully!' }));
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const ModelData = await LoadModelDetail(parseInt(model.modelId!));
        setModelData(ModelData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
    };

    fetchData();
  }, []);

  if (!modelData) return <Preloader />;

  return (
    <ModelDetailLayout
      bordered={true}
      image={modelData.files.mainFile}
      editButtonId={
        User.isAuthenticated ? (User.user?.clearance === 2 ? modelData?.id : undefined) : undefined
      }
    >
      <Label size="lg" className="kanit-regular lts-1">
        {modelData.name}
      </Label>
      <p className="ms-3 mt-4 kanit-light w-80 overflow-auto max-h-20-vh">{modelData?.desc}</p>
      <ModelInfoSection name="Category">
        <p className="m-0 w-50" key={modelData.category.id}>
          {modelData.category.name}
        </p>
      </ModelInfoSection>
      <ModelInfoSection name="Tags">
        <div className="w-50 mt-2 d-flex flex-wrap">
          {modelData.tags?.map((tag) => {
            return <AssetTag key={tag.id} name={tag.name} />;
          })}
        </div>
      </ModelInfoSection>
      <div className="sticky-bottom mt-4 ms-4 pb-4">
        <Button
          onClick={() => Download(modelData.files.mainFile.bin, modelData.files.mainFile.type)}
          className="d-flex justify-content-center mt-6 download"
        >
          Download
        </Button>
      </div>
    </ModelDetailLayout>
  );
};

export default ModelDetail;
