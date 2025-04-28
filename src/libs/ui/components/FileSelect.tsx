import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { UploadedFile } from './UploadedFile';
import { Input } from './Input';

export interface FileOption {
  name: string;
  type: string;
  isHidden: boolean;
  isMain: boolean;

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
    });
    setFiles(updatedFiles);

    event.target.value = '';
  };

  return (
    <>
      <div className="input-group mb-2">
        <button
          onClick={() => {
            if (!fileInputRef.current) return;
            fileInputRef.current.click();
          }}
          className="form-control text-start d-flex justify-content-between"
        >
          Upload file
          <FontAwesomeIcon icon={faFile} className="fs-2" />
        </button>
      </div>
      <Input ref={fileInputRef} onChange={addFile} className="d-none" type="file" />
      <div className="w-100 overflow-y-auto" style={{ maxHeight: '249px' }}>
        {files.map((file, index) => {
          return (
            <div className="w-100" key={index}>
              <UploadedFile
                file={file}
                onClose={() => {
                  const updatedFiles = [...files];
                  updatedFiles.splice(index, 1);
                  setFiles(updatedFiles);
                }}
              />
              {index < files.length - 1 && (
                <div className="w-100 my-1 d-flex justify-content-center">
                  <div className="w-80" style={{ backgroundColor: 'black', height: '1px' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
