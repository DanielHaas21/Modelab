import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { UploadedFile } from './UploadedFile';

export interface FileOption {
  name: string;
  type: string;
  isHidden: boolean;
  isMain: boolean;
  isPreview: boolean;

  id?: number;
  file?: File;
}

interface FileSelectProps {
  files: FileOption[];
  setFiles: React.Dispatch<React.SetStateAction<FileOption[]>>;
}

export const FileSelect: React.FC<FileSelectProps> = ({ files, setFiles }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const updatedFiles = [...files];
    updatedFiles.push({
      file,
      name: file.name,
      type: file.type,
      isMain: false,
      isHidden: false,
      isPreview: false,
    });
    setFiles(updatedFiles);

    event.target.value = '';
  };

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
          <span className="kanit-regular text-text-700 group-hover:text-text-950">Add more files...</span>
          <FontAwesomeIcon icon={faFile} className="text-xl text-primary-500" />
        </button>
      </div>
      <input ref={fileInputRef} onChange={addFile} className="hidden" type="file" />
      <div className="w-full overflow-x-auto h-[400px] sm:h-fit flex flex-col sm:flex-row gap-4 pb-4 custom-scrollbar">
        {files.map((file, index) => {
          return (
            <div className="min-w-[300px] w-full sm:max-w-[300px]" key={index}>
              <UploadedFile
                index={index}
                file={file}
                onClose={() => {
                  const updatedFiles = [...files];
                  updatedFiles.splice(index, 1);
                  setFiles(updatedFiles);
                }}
                onChange={(isMain, isPreview, isHidden) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = {
                    ...file,
                    isMain: isMain,
                    isPreview: isPreview,
                    isHidden: isHidden,
                  };
                  setFiles(updatedFiles);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
