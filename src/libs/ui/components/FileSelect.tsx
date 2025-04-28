import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { UploadedFile } from './UploadedFile';
import { Input } from './Input';

const Separator = (
  <div className="w-100 my-1 d-flex justify-content-center">
    <div className="w-80" style={{ backgroundColor: 'black', height: '1px' }} />
  </div>
);

interface FileSelectProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const FileSelect: React.FC<FileSelectProps> = ({ files, setFiles }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const updatedFiles = [...files];
    updatedFiles.push(file);
    setFiles(updatedFiles);

    event.target.value = '';
  };

  return (
    <>
      <div className="input-group">
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
      <div className="w-100 overflow-y-auto" style={{ maxHeight: '336px' }}>
        {files.map((file, index) => {
          return (
            <>
              <UploadedFile
                file={file}
                onClose={() => {
                  const updatedFiles = [...files];
                  updatedFiles.splice(index, 1);
                  setFiles(updatedFiles);
                }}
              />
              {index < files.length - 1 && Separator}
            </>
          );
        })}
      </div>
    </>
  );
};
