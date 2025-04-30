import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from './Label';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FileOption } from './FileSelect';
import React from 'react';

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

export const UploadedFile: React.FC<UploadedFileProps> = ({ file, onClose, onChange, index }) => {
  const [isMain, setIsMain] = React.useState<boolean>(file.isMain);
  const [isHidden, setIsHidden] = React.useState<boolean>(file.isHidden);
  const [isPreview, setIsPreview] = React.useState<boolean>(file.isPreview);

  React.useEffect(() => {
    setIsMain(file.isMain);
    setIsHidden(file.isHidden);
  }, [file]);

  React.useEffect(() => {
    onChange(isMain, isPreview, isHidden);
  }, [isMain, isPreview, isHidden]);

  return (
    <div className="w-100 ps-1 d-flex flex-column align-items-center">
      <div className="w-100 d-flex justify-content-between align-items-center">
        <Label size={'xxs'} className="text-truncate">
          {formatName(file)}
        </Label>
        <button className="btn" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <p style={{ opacity: 0.4 }} className="w-100 mb-1">
        {file.name} ({formatType(file)})
      </p>
      <div className="pe-4 w-100">
        <div className="btn-group w-100 border" role="group">
          <input
            type="checkbox"
            className="btn-check"
            autoComplete="off"
            id={`${index}a`}
            disabled={isHidden}
            checked={isMain}
            onChange={() => {
              setIsMain(!isMain);
            }}
          />
          <label className="btn form-control" htmlFor={`${index}a`}>
            Main
          </label>

          <input
            type="checkbox"
            className="btn-check"
            autoComplete="off"
            id={`${index}b`}
            disabled={isHidden}
            checked={isPreview}
            onChange={() => {
              setIsPreview(!isPreview);
            }}
          />
          <label className="btn form-control" htmlFor={`${index}b`}>
            Preview
          </label>

          <input
            type="checkbox"
            className="btn-check"
            autoComplete="off"
            id={`${index}c`}
            checked={isHidden}
            onChange={() => {
              setIsHidden(!isHidden);
            }}
          />
          <label className="btn form-control" htmlFor={`${index}c`}>
            Hidden
          </label>
        </div>
      </div>
    </div>
  );
};
