import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { UploadedFile } from './UploadedFile';
import { getFileType } from '../../utils/getFileType';
import { useToast, useTranslation } from '../../hooks';
import { ManageFile } from '../../../middleware/types/actions';

interface FileSelectProps {
  files: ManageFile[];
  setFiles: React.Dispatch<React.SetStateAction<ManageFile[]>>;
}

export const FileSelect: React.FC<FileSelectProps> = ({ files, setFiles }) => {
  const t = useTranslation('ui.file_select');
  const { show } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    event.target.value = '';

    const fileType = getFileType(file);

    if (fileType === null) {
      show({
        title: 'Unsupported file format!',
        variant: 'error',
        description: `File '${file.name}' is not supported`
      });
      return;
    }

    setFiles((prev) => [
      ...prev,
      {
        type: 'local',
        localFile: file,
        name: file.name,
        fileType: fileType,
        isMain: false,
        isHidden: false,
        isPreview: false,
        isRemoved: false,
      },
    ]);
  };

  const filesRender = files.map((file, index) => (
    <div className="min-w-[300px] w-full sm:max-w-[300px]" key={index}>
      <UploadedFile
        index={index}
        file={file}
        isRemoved={file.isRemoved}
        onRestore={() => {
          setFiles((prev) => {
            const updatedFiles = [...prev];
            if (updatedFiles[index]) {
              updatedFiles[index] = {
                ...updatedFiles[index],
                isRemoved: false,
              };
            }
            return updatedFiles;
          });
        }}
        onClose={() => {
          setFiles((prev) => {
            const updatedFiles = [...prev];
            if (updatedFiles[index]) {
              updatedFiles[index] = {
                ...updatedFiles[index],
                isRemoved: true,
              };
            }
            return updatedFiles;
          });
        }}
        onChange={(isMain, isPreview, isHidden) => {
          setFiles((prev) => {
            const updatedFiles = [...prev];
            for (let i = 0; i < updatedFiles.length; i++) {
              const updatedFile = updatedFiles[i];
              if (i === index) {
                updatedFile.isMain = isMain;
                updatedFile.isPreview = isPreview;
                updatedFile.isHidden = isHidden;
              } else {
                updatedFile.isPreview = false;
              }
              updatedFiles[i] = updatedFile;
            }
            return updatedFiles;
          });
        }}
      />
    </div>
  )
  )

  return (
    <div className="w-full">
      <div className="mb-4">
        <button
          onClick={() => {
            if (!fileInputRef.current) return;
            fileInputRef.current.click();
          }}
          className="flex items-center justify-between w-full bg-bg-100 border border-ui-border rounded-lg px-4 py-3 hover:bg-bg-200 transition-all group"
        >
          <span className="font-normal text-text-700 group-hover:text-text-950">{t('add_more')}</span>
          <FontAwesomeIcon icon={faFile} className="text-xl text-primary-500" />
        </button>
      </div>
      <input ref={fileInputRef} onChange={addFile} className="hidden" type="file" />
      <div className="w-full overflow-x-auto h-[400px] sm:h-fit flex flex-col sm:flex-row gap-4 pb-4 custom-scrollbar">
        {filesRender}
      </div>
    </div>
  );
};