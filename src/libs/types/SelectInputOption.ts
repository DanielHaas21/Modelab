/** 
*  Represents a single option for a SelectInput element
*/
export type SelectInputOption = {
  value: any;
  label: string;
  props?: React.OptionHTMLAttributes<HTMLOptionElement>;
};