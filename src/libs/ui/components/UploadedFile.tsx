import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from './Label';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FileOption } from './FileSelect';

interface UploadedFileProps {
  file: FileOption;
  onClose: () => void;
}

const formatName = (file: FileOption) => {
  return file.name.split('.')[0];
};

const formatType = (file: FileOption) => {
  return file.name.split('.')[1].toUpperCase() || file.type;
};

export const UploadedFile: React.FC<UploadedFileProps> = ({ file, onClose }) => {
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
      <p style={{ opacity: 0.4 }} className="w-100">
        {file.name} ({formatType(file)})
      </p>
    </div>
  );
};
