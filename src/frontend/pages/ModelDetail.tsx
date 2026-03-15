import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { useParams } from 'react-router-dom';
import {
  confirm,
  ErrorDisplay,
  GeneralPopup,
  Label,
  ModelInfoSection,
  Preloader,
  useToast,
} from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import { ModelDetailData, DetailFile } from '../../middleware/types';
import loadModelDetail from '../../middleware/actions/LoadModelDetail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import icon_boom from '../../libs/ui/assets/icon_boom.png';
import { BaseLayout } from '../../libs/ui/layouts';
import { useCheckClearance, useValidatePermission } from '../../libs/auth';
import JSZip from 'jszip';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';
import { ModelDetailImageCarousel } from '../../libs/ui/components/ModelDetailImageCarousel';
import { CLEARANCE } from '../../store/types';
import { BrowserRoutes } from '../../global/BrowserRoutes';

const ModelDetail: React.FC = () => {
  useValidatePermission(CLEARANCE.GUEST, BrowserRoutes.Browser);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modelDetailData, setModelDetailData] = React.useState<ModelDetailData | null>(null);

  const model = useParams();
  const Dispatch = useDispatch<AppDispatch>();
  const { show } = useToast();

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  const { isDesktop } = useResponsive();

  const UserData = useSelector((state: RootState) => state.User);
  const { hasClearance } = useCheckClearance();

  const downloadAllAsZip = async (files: DetailFile[]) => {
    if (modelDetailData === null) return;
    const modelData = modelDetailData.model;

    const displayFilesConfirmed = await confirm(
      'Download',
      true,
      Dispatch,
      'Download',
      'Cancel',
      <>
        <p>Following files will be downloaded:</p>
        <ul className="w-100 list-group">
          {modelData.files.filter(file => file.download !== null).map((file, index) => (
            <li className="list-group-item" key={index}>
              {file.name}
            </li>
          ))}
        </ul>
      </>
    );

    if (!displayFilesConfirmed) return;

    const zip = new JSZip();

    for (const file of files) {
      if (file.download === null) continue;
      try {
        const blob = await file.download();
        zip.file(file.name, blob);
      } catch (error) {
        console.error('Downloading error:', error);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = modelData.name ? modelData.name + '.zip' : 'asset.zip';
    document.body.appendChild(link);

    link.click();
    show({ variant: 'success', title: 'Asset saved successfully!' });

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const assetId = parseInt(model.modelId!);
        const modelData = await loadModelDetail(assetId, UserData.auth.clearance);
        setModelDetailData(modelData);
      } catch (error) {
        console.error('Error fetching model data:', error);
      }
      setIsLoading(false);
    })();
  }, [UserData.auth.clearance]);

  if (isLoading) return <Preloader className="min-h-screen" />;

  if (!modelDetailData) {
    return (
      <BaseLayout bordered={true}>
        <ErrorDisplay image={icon_boom} code={404} message="Oops! Asset not found">
          <p>The asset you're looking for doesn't exist or has been moved.</p>
        </ErrorDisplay>
      </BaseLayout>
    );
  }

  const modelData = modelDetailData.model;

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        bordered={true}
        files={modelData.files}
        goBackButton={{
          onClick: () => { }
        }}
        editButton={hasClearance(CLEARANCE.USER)
          ? { id: modelData.id }
          : undefined
        }
      >
        <Label size="lg" className={"font-normal tracking-[0.1rem] overflow-y-auto"}>
          {modelData.name}
        </Label>
        <p className="ms-3 mt-4 font-light w-80 overflow-auto max-h-[20vh]">{modelData.description}</p>
        <ModelInfoSection name="Category">
          <p className="m-0" key={modelData.category.id}>
            {modelData.category.name}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name="Tags">
          <div className="mt-2 flex flex-wrap">
            {modelData.tags.map((tag) => {
              return <AssetTag key={tag.id} name={tag.name} />;
            })}
          </div>
        </ModelInfoSection>
        <div className={cn("sticky bottom-0 mt-6 pb-4 flex flex-col gap-2", isDesktop && "ms-4")}>
          <Button
            onClick={() => downloadAllAsZip(modelData.files)}
            disabled={!hasClearance(CLEARANCE.USER)}
            className={cn("flex justify-center", !isDesktop && "w-100")}
          >
            Download
          </Button>
          {!isDesktop && (
            <Button
              variant="secondary"
              onClick={() => offcanvasHandleRef.current?.open()}
              className="flex justify-center w-100"
            >
              Preview
            </Button>
          )}
        </div>
        {!isDesktop && (
          <OffcanvasModal ref={offcanvasHandleRef} title='Preview' >
            <ModelDetailImageCarousel files={modelData.files} />
          </OffcanvasModal>
        )}
      </ModelDetailLayout>
    </>
  );
};

export default ModelDetail;
