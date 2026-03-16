import { Input } from './Input';
import { Label } from './Label';

interface CopyableFieldProps {
  fieldName: string;
  fieldValue: string;
}

/**
 * A component for selecting categories. It displays a list of category options as checkboxes (or radio buttons if isRadio is true)
 * @param props 
 * @returns 
 */
export const CopyableField: React.FC<CopyableFieldProps> = ({ fieldName, fieldValue }) => {
  return (
    <div
      className='w-full cursor-pointer'
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(fieldValue);
      }}
    >
      <Label size="xs" className='font-normal text-gray-700' htmlFor='cite-name'>
        {fieldName}
      </Label>
      <Input
        id='cite-name'
        type="text"
        className="w-full"
        inputClassName="text-xl font-medium tracking-wide cursor-pointer tracking-[0.1rem] hover:text-gray-500 active:text-gray-700 transition duration-150"
        size={'xl'}
        value={fieldValue}
        readOnly
      />
    </div>
  );
};