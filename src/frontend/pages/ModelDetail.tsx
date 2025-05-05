import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { confirm, ErrorDisplay, GeneralPopup, Label, ModelInfoSection, Preloader } from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import { ModelData } from '../../middleware/types';
import LoadModelDetail from '../../middleware/actions/LoadModelDetail';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { Add } from '../../store/slices/Message';
import icon_boom from '../../libs/ui/assets/icon_boom.png';
import { BaseLayout } from '../../libs/ui/layouts';
import { useValidatePermission } from '../../libs/auth';
import JSZip from 'jszip';
import { ModelFileProps } from '../../libs/types/ModelFileProps';

const ModelDetail: React.FC = () => {
  useValidatePermission(1, '/Browser');

  const [modelData, setModelData] = React.useState<ModelData | null>(null);
  const model = useParams();
  const User = useSelector((state: RootState) => state.User);
  const Dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const DownloadAllAsZip = async (files: ModelFileProps[]) => {

    const DisplayFiles = await confirm("dd",true, Dispatch);
    
    const zip = new JSZip();

    const fetchFile = async (file: ModelFileProps) => {
      const response = await fetch(file.bin);
      const blob = await response.blob();
      zip.file(file.name, blob);
    };

    await Promise.all(files.map(fetchFile));

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = modelData?.name ? modelData.name + '.zip' : 'asset.zip';
    document.body.appendChild(link);

    link.click();
    Dispatch(Add({ variant: 'Success', message: 'Asset saved successfully!' }));

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ModelData = await LoadModelDetail(parseInt(model.modelId!));
        setModelData(ModelData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <Preloader className="min-h-100-vh" />;

  if (!modelData)
    return (
      <BaseLayout bordered={true}>
        <ErrorDisplay image={icon_boom} code={404} message="Oops! Asset not found">
          <p>The asset you're looking for doesn't exist or has been moved.</p>
        </ErrorDisplay>
      </BaseLayout>
    );

  return (
    <>
      <GeneralPopup></GeneralPopup>
     <ModelDetailLayout
      bordered={true}
      image={modelData.files}
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
          onClick={() => DownloadAllAsZip(modelData.files)}
          className="d-flex justify-content-center mt-6 download"
        >
          Download
        </Button>
      </div>
    </ModelDetailLayout>
    </>
  );
};

export default ModelDetail;
