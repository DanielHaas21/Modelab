import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from './Label';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useTranslation } from '../../hooks';
import { ManageFile } from '../../../new_middleware/types/actions';

interface UploadedFileProps {
  index: number;
  file: ManageFile;
  isRemoved: boolean;
  onClose: () => void;
  onRestore: () => void;
  onChange: (isMain: boolean, isPreview: boolean, isHidden: boolean) => void;
}

const formatName = (file: ManageFile) => {
  return file.name.split('.')[0];
};

const formatType = (file: ManageFile) => {
  return file.name.split('.')[1]?.toUpperCase() || file.fileType;
};

/**
 * A component for displaying an uploaded file with options to mark it as main, preview, or hidden. It includes a close button to remove the file.
 * @param props The props for the UploadedFile component.
 * @returns 
 */
export const UploadedFile: React.FC<UploadedFileProps> = ({ file, onClose, onRestore, onChange, index, isRemoved }) => {
  const t = useTranslation('ui.uploaded_file');

  return (
    <div className="relative overflow-hidden w-full pl-1 flex flex-col bg-bg-100/50 p-3 rounded-lg border border-ui-border/30 hover:border-ui-border transition-colors">
      {isRemoved && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#ff0000a2] backdrop-blur-[2px]">
          <span className="text-white font-bold mb-2">Removed</span>
          <button
            type="button"
            className="bg-white text-red-600 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors shadow-sm"
            onClick={onRestore}
          >
            Bring back
          </button>
        </div>
      )}

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
              disabled={file.isHidden}
              checked={file.isMain}
              onChange={() => onChange(!file.isMain, file.isPreview, file.isHidden)}
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
              disabled={file.isHidden}
              checked={file.isPreview}
              onChange={() => onChange(file.isMain, !file.isPreview, file.isHidden)}
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
              checked={file.isHidden}
              onChange={() => onChange(file.isMain, file.isPreview, !file.isHidden)}
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