import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link, useParams } from 'react-router-dom';
import {
  confirm,
  ErrorDisplay,
  GeneralPopup,
  Input,
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
import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '../../libs/ui/provider';
import { CopyableField } from '../../libs/ui/components/CopyableField';
import { generateCzechISO690 } from '../../libs/utils/generateIso';

const ModelDetail: React.FC = () => {
  useValidatePermission(CLEARANCE.GUEST, BrowserRoutes.Browser);

  const t = useTranslation("pages.model_detail");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modelDetailData, setModelDetailData] = React.useState<ModelDetailData | null>(null);

  const model = useParams();
  const Dispatch = useDispatch<AppDispatch>();
  const { show } = useToast();

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  const { isDesktop } = useResponsive();

  const UserData = useSelector((state: RootState) => state.User);
  const { hasClearance } = useCheckClearance();

  // zip download of all files

  const downloadAllAsZip = async (files: DetailFile[]) => {
    if (modelDetailData === null) return;
    const modelData = modelDetailData.model;

    const displayFilesConfirmed = await confirm(
      t("confirm.download"),
      true,
      Dispatch,
      t("confirm.download"),
      t("confirm.cancel"),
      <>
        <p>{t("confirm.note")}</p>
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
    show({ variant: 'success', title: t("saved") });

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
        <ErrorDisplay image={icon_boom} code={404} message={t("oops")}>
          <p>{t("notFound")}</p>
        </ErrorDisplay>
      </BaseLayout>
    );
  }

  const GenerateCitationDataHandle = async () => {
    if (modelDetailData === null) return;

    const czechISO690 = generateCzechISO690(
      modelDetailData.model.author ?? 'Modelab',
      modelDetailData.model.name,
      `${window.location.origin}${location.pathname}${location.search}`,
      modelDetailData.model.created,
    );

    await confirm(
      t("citation.title"),
      false,
      Dispatch,
      t("citation.close"),
      undefined,
      <div>
        <Label size="xs" className='font-normal tracking-[0.1rem]'>
          {t("citation.copy")}
        </Label>
        <div className='flex flex-col justify-center items-center gap-2'>
          <CopyableField
            fieldName={t("citation.name")}
            fieldValue={modelDetailData.model.name}
          />
          <CopyableField
            fieldName={t("citation.author")}
            fieldValue={modelDetailData.model.author ?? 'Modelab'}
          />
          <CopyableField
            fieldName={t("citation.created")}
            fieldValue={modelDetailData.model.created.toLocaleDateString('cs-CZ')}
          />
          <CopyableField
            fieldName={t("citation.url")}
            fieldValue={modelDetailData.model.name}
          />
        </div>
        <div className="grow h-px my-2 bg-ui-border" />
        <div className='flex flex-col justify-start items-start'>
          <Label size="xs" className='font-normal tracking-[0.1rem]'>
            {t("citation.cziso690")}
          </Label>
          <Label size="xs"
            className='font-normal tracking-[0.1rem] cursor-pointer hover:text-gray-500 active:text-gray-700 transition duration-150'
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(czechISO690);
            }}
          >
            {czechISO690}
          </Label>
        </div>
      </div>
    );
  }

  const modelData = modelDetailData.model;

  const ActionButtons = (
    <>
      <div className="w-1/2 p-1">
        <Link
          className="no-underline"
          to={BrowserRoutes.Browser}>
          <Button variant="light" className="justify-between w-full">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="w-full">{t("back")}</span>
          </Button>
        </Link>
      </div>
      {hasClearance(CLEARANCE.ADMIN) && (
        <div className="w-1/2 p-1">
          <Link className="no-underline" to={BrowserRoutes.ModelManage + modelData.id}>
            <Button variant="light" className="justify-between w-full">
              <FontAwesomeIcon icon={faPencil} />
              <span className="w-full">{t("edit")}</span>
            </Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <>
      <GeneralPopup />
      <ModelDetailLayout
        bordered={true}
        files={modelData.files}
        buttons={ActionButtons}
      >
        <Label size="lg" className={"font-normal tracking-[0.1rem] overflow-y-auto"}>
          {modelData.name}
        </Label>
        <p className="ms-3 mt-4 font-light w-80 overflow-auto max-h-[20vh]">{modelData.description}</p>
        <ModelInfoSection name={t("author_name")}>
          <p className="m-0">
            {modelData.author}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name={t("category")}>
          <p className="m-0" key={modelData.category.id}>
            {modelData.category.name}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name={t("tags")}>
          <div className="mt-2 flex flex-wrap">
            {modelData.tags.map((tag) => {
              return <AssetTag key={tag.id} name={tag.name} />;
            })}
          </div>
        </ModelInfoSection>
        <div className={cn("sticky bottom-0 mt-6 pb-4 flex flex-col md:flex-row gap-2", isDesktop && "ms-4")}>
          <Button
            onClick={() => downloadAllAsZip(modelData.files)}
            disabled={!hasClearance(CLEARANCE.USER)}
            className={cn("flex justify-center", !isDesktop && "w-full")}
          >
            {t("download_all")}
          </Button>
          <Button
            onClick={() => GenerateCitationDataHandle()}
            disabled={!hasClearance(CLEARANCE.USER)}
            className={cn("flex justify-center", !isDesktop && "w-full")}
          >
            {t("generate_citation")}
          </Button>
          {!isDesktop && (
            <Button
              variant="secondary"
              onClick={() => offcanvasHandleRef.current?.open()}
              className="flex justify-center w-full"
            >
              {t("preview")}
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
