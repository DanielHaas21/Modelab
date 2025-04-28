import { Label } from './Label';

interface ModelInfoSectionProps {
  name: string;
  children?: React.ReactNode;
}

export const ModelInfoSection: React.FC<ModelInfoSectionProps> = ({ name, children }) => {
  return (
    <div className="ms-3 mt-2 d-flex justify-content-between">
      <Label size="xxs" className="kanit-regular">
        {name}
      </Label>
      <div className="d-flex justify-content-start flex-wrap flex-row w-50">{children}</div>
    </div>
  );
};
