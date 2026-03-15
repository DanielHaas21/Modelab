import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from './Label';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FileOption } from './FileSelect';
import React from 'react';
import { useTranslation } from '../provider';

interface UploadedFileProps {
  index: number;
  file: FileOption;
  onClose: () => void;
  onChange: (isMain: boolean, isPreview: boolean, isHidden: boolean) => void;
}

const formatName = (file: FileOption) => {
  return file.name.split('.')[0];
};

const formatType = (file: FileOption) => {
  return file.name.split('.')[1].toUpperCase() || file.type;
};

/**
 * A component for displaying an uploaded file with options to mark it as main, preview, or hidden. It includes a close button to remove the file.
 * @param props The props for the UploadedFile component.
 * @returns 
 */
export const UploadedFile: React.FC<UploadedFileProps> = ({ file, onClose, onChange, index }) => {
  const [isMain, setIsMain] = React.useState<boolean>(file.isMain);
  const [isHidden, setIsHidden] = React.useState<boolean>(file.isHidden);
  const [isPreview, setIsPreview] = React.useState<boolean>(file.isPreview);
  const t = useTranslation('ui.uploaded_file');

  React.useEffect(() => {
    setIsMain(file.isMain);
    setIsHidden(file.isHidden);
  }, [file]);

  React.useEffect(() => {
    onChange(isMain, isPreview, isHidden);
  }, [isMain, isPreview, isHidden]);

  return (
    <div className="w-full pl-1 flex flex-col bg-bg-100/50 p-3 rounded-lg border border-ui-border/30 hover:border-ui-border transition-colors">
      <div className="w-full flex justify-between items-center mb-1">
        <Label size={'xxs'} className="truncate font-medium max-w-[200px]">
          {formatName(file)}
        </Label>
        <button className="text-text-400 hover:text-accent-500 transition-colors p-1" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <p className="w-full text-xs opacity-40 mb-3 truncate">
        {file.name} • {formatType(file)}
      </p>
      <div className="w-full">
        <div className="flex w-full border border-ui-border rounded-md overflow-hidden divide-x divide-ui-border" role="group">
          <div className="flex-1">
            <input
              type="checkbox"
              className="peer hidden"
              autoComplete="off"
              id={`${index}a`}
              disabled={isHidden}
              checked={isMain}
              onChange={() => setIsMain(!isMain)}
            />
            <label className="block w-full text-center py-1.5 text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all peer-checked:bg-primary-500 peer-checked:text-white hover:bg-primary-500/10 hover:text-primary-500 peer-checked:hover:bg-primary-600 peer-checked:hover:text-white peer-disabled:opacity-20 peer-disabled:cursor-not-allowed" htmlFor={`${index}a`}>
              {t('main')}
            </label>
          </div>

          <div className="flex-1">
            <input
              type="checkbox"
              className="peer hidden"
              autoComplete="off"
              id={`${index}b`}
              disabled={isHidden}
              checked={isPreview}
              onChange={() => setIsPreview(!isPreview)}
            />
            <label className="block w-full text-center py-1.5 text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all peer-checked:bg-primary-500 peer-checked:text-white hover:bg-primary-500/10 hover:text-primary-500 peer-checked:hover:bg-primary-600 peer-checked:hover:text-white peer-disabled:opacity-20 peer-disabled:cursor-not-allowed" htmlFor={`${index}b`}>
              {t('preview')}
            </label>
          </div>

          <div className="flex-1">
            <input
              type="checkbox"
              className="peer hidden"
              autoComplete="off"
              id={`${index}c`}
              checked={isHidden}
              onChange={() => setIsHidden(!isHidden)}
            />
            <label className="block w-full text-center py-1.5 text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all peer-checked:bg-accent-500 peer-checked:text-white hover:bg-accent-500/10 hover:text-accent-500 peer-checked:hover:bg-accent-600 peer-checked:hover:text-white" htmlFor={`${index}c`}>
              {t('hidden')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
