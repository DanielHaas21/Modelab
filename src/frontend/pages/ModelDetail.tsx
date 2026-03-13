import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  confirm,
  ErrorDisplay,
  GeneralPopup,
  Label,
  ModelInfoSection,
  Preloader,
} from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import { ModelData } from '../../middleware/types';
import LoadModelDetail from '../../middleware/actions/LoadModelDetail';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { Add } from '../../store/slices/Message';
import icon_boom from '../../libs/ui/assets/icon_boom.png';
import { BaseLayout } from '../../libs/ui/layouts';
import { useCheckClearance, useValidatePermission } from '../../libs/auth';
import JSZip from 'jszip';
import { ModelFileProps } from '../../libs/types/ModelFileProps';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';
import { ModelDetailImageCarousel } from '../../libs/ui/components/ModelDetailImageCarousel';
import { CLEARANCE } from '../../store/types';
import { BrowserRoutes } from '../../global/BrowserRoutes';

const ModelDetail: React.FC = () => {
  useValidatePermission(CLEARANCE.GUEST, BrowserRoutes.Browser);

  const [modelData, setModelData] = React.useState<ModelData | null>(null);
  const model = useParams();
  const Dispatch = useDispatch<AppDispatch>();

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { isDesktop } = useResponsive();
  const { hasClearance } = useCheckClearance();

  const downloadAllAsZip = async (files: ModelFileProps[]) => {
    const displayFilesConfirmed = await confirm(
      'Download',
      true,
      Dispatch,
      'Download',
      'Cancel',
      <>
        <p>Following files will be downloaded:</p>
        <ul className="w-100 list-group">
          {modelData?.files.map((file, index) => (
            <li className="list-group-item" key={index}>
              {file.name}
            </li>
          ))}
        </ul>
      </>
    );

    if (!displayFilesConfirmed) return;

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
      <GeneralPopup />
      <ModelDetailLayout
        bordered={true}
        image={modelData.files}
        editButtonId={
          hasClearance(CLEARANCE.USER)
            ? modelData?.id
            : undefined
        }
      >
        <Label size="lg" className={"kanit-regular lts-1 overflow-y-auto"}>
          {modelData.name}
        </Label>
        <p className="ms-3 mt-4 kanit-light w-80 overflow-auto max-h-20-vh">{modelData?.desc}</p>
        <ModelInfoSection name="Category">
          <p className="m-0" key={modelData.category.id}>
            {modelData.category.name}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name="Tags">
          <div className="mt-2 d-flex flex-wrap">
            {modelData.tags?.map((tag) => {
              return <AssetTag key={tag.id} name={tag.name} />;
            })}
          </div>
        </ModelInfoSection>
        <div className={cn("sticky-bottom mt-6 pb-4 d-flex flex-column gap-2", isDesktop && "ms-4")}>
          <Button
            onClick={() => downloadAllAsZip(modelData.files)}
            className={cn("d-flex justify-content-center", !isDesktop && "w-100")}
          >
            Download
          </Button>
          {!isDesktop && (
            <Button
              variant="secondary"
              onClick={() => offcanvasHandleRef.current?.open()}
              className="d-flex justify-content-center w-100"
            >
              Preview
            </Button>
          )}
        </div>
        {!isDesktop && (
          <OffcanvasModal ref={offcanvasHandleRef} title='Preview' >
            <ModelDetailImageCarousel image={modelData.files} />
          </OffcanvasModal>
        )}
      </ModelDetailLayout>
    </>
  );
};

export default ModelDetail;
