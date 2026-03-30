import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link, useParams } from 'react-router-dom';
import {
  ErrorDisplay,
  Label,
  ModelInfoSection,
  Preloader,
} from '../../libs/ui/components';
import { AssetTag } from '../../libs/ui/components/AssetTag';
import { loadModelDetailContext } from '../../middleware/actions/loadModelDetailContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import icon_boom from '../../libs/ui/assets/icon_boom.png';
import { BaseLayout } from '../../libs/ui/layouts';
import { useCheckClearance, useValidatePermission } from '../../libs/auth';
import JSZip from 'jszip';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';
import { ModelDetailImageCarousel } from '../../libs/ui/components/ModelDetailImageCarousel';
import { CLEARANCE } from '../../store/types';
import { ROOT_ROUTES } from '../../global/routes';
import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyableField } from '../../libs/ui/components/CopyableField';
import { generateCzechISO690 } from '../../libs/utils/generateIso';
import { useResponsive, useTitle, useToast, useTranslation } from '../../libs/hooks';
import { AssetFile, ModelDetailContext } from '../../middleware/types/actions';
import { confirmPopup, GeneralPopup } from '../../libs/ui/components/Popup';

interface ModelDetailProps {
  context: ModelDetailContext;
}

const ModelDetail: React.FC<ModelDetailProps> = ({ context }) => {
  useValidatePermission(CLEARANCE.GUEST, ROOT_ROUTES.Browser);

  const t = useTranslation("pages.model_detail");

  const { show } = useToast();
  const { isDesktop } = useResponsive();
  const { hasClearance } = useCheckClearance();

  const Dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = React.useState<string>('Loading...');
  useTitle({ type: 'name', name: title });

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  React.useEffect(() => {
    setTitle(context.asset.name);
  }, [context]);

  // zip download of all files
  const downloadAllAsZip = async (files: AssetFile[]) => {
    const asset = context.asset;

    const displayFilesConfirmed = await confirmPopup(
      t("confirm.download"),
      true,
      Dispatch,
      t("confirm.download"),
      t("confirm.cancel"),
      <>
        <p>{t("confirm.note")}</p>
        <ul className="w-full list-group">
          {asset.files.filter(file => file.download !== null).map((file, index) => (
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
    link.download = asset.name ? asset.name + '.zip' : 'asset.zip';
    document.body.appendChild(link);

    link.click();
    show({ variant: 'success', title: t("saved") });

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const GenerateCitationDataHandle = async () => {
    const asset = context.asset;

    const url = `${window.location.origin}${location.pathname}${location.search}`;
    const czechISO690 = generateCzechISO690(
      asset.author ?? 'Modelab',
      asset.name,
      url,
      asset.created,
    );

    await confirmPopup(
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
            fieldValue={asset.name}
          />
          <CopyableField
            fieldName={t("citation.author")}
            fieldValue={asset.author ?? 'Modelab'}
          />
          <CopyableField
            fieldName={t("citation.created")}
            fieldValue={asset.created.toLocaleDateString('cs-CZ')}
          />
          <CopyableField
            fieldName={t("citation.url")}
            fieldValue={url}
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

  const ActionButtons = (
    <>
      <div className="w-1/2 p-1">
        <Link
          className="no-underline"
          to={ROOT_ROUTES.Browser}>
          <Button variant="light" className="justify-between w-full">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="w-full">{t("back")}</span>
          </Button>
        </Link>
      </div>
      {hasClearance(CLEARANCE.ADMIN) && (
        <div className="w-1/2 p-1">
          <Link className="no-underline" to={ROOT_ROUTES.ModelManage + context.asset.id}>
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
        files={context.asset.files}
        buttons={ActionButtons}
      >
        <Label size="lg" className={"font-normal tracking-[0.1rem] overflow-y-auto"}>
          {context.asset.name}
        </Label>
        <p className="ms-3 mt-4 font-light w-80 overflow-auto max-h-[20vh]">{context.asset.description}</p>
        <ModelInfoSection name={t("author_name")}>
          <p className="m-0">
            {context.asset.author}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name={t("category")}>
          <p className="m-0" key={context.asset.category.id}>
            {context.asset.category.name}
          </p>
        </ModelInfoSection>
        <ModelInfoSection name={t("tags")}>
          <div className="mt-2 flex flex-wrap">
            {context.asset.tags.map((tag) => {
              return <AssetTag key={tag.id} name={tag.name} />;
            })}
          </div>
        </ModelInfoSection>
        <div className={cn("sticky bottom-0 mt-6 pb-4 flex flex-col md:flex-row gap-2", isDesktop && "ms-4")}>
          <Button
            onClick={() => downloadAllAsZip(context.asset.files)}
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
            <ModelDetailImageCarousel files={context.asset.files} />
          </OffcanvasModal>
        )}
      </ModelDetailLayout>
    </>
  );
};

const ModelDetailLoader: React.FC = () => {
  const t = useTranslation("pages.model_detail");

  const model = useParams();
  const UserData = useSelector((state: RootState) => state.User);

  const [context, setContext] = React.useState<ModelDetailContext | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const assetId = parseInt(model.modelId!);
        const context = await loadModelDetailContext(assetId, UserData.auth.clearance);
        setContext(context);
      } catch (error) {
        console.error('Error fetching model data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [UserData.auth.clearance, model.modelId]);

  if (isLoading) return <Preloader className="min-h-screen" />;

  if (context === null) {
    return (
      <BaseLayout bordered={true}>
        <ErrorDisplay image={icon_boom} code={404} message={t("oops")}>
          <p>{t("notFound")}</p>
        </ErrorDisplay>
      </BaseLayout>
    );
  }

  return (
    <ModelDetail
      context={context}
    />
  );
}

export default ModelDetailLoader;
