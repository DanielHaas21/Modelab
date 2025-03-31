import * as React from "react";
import { Input, type InputProps } from "./Input"; // this component uses the Input component as a base 
import { Label } from "./Label"; 
import { cn } from "../../utils";

export interface DatepickerProps
  extends Omit<InputProps, "type" | "size"> {  
  className?: string;
  datetime?: boolean; 
  labelText?: string; // Label text to appear above the input
  labelSize?: "xs" | "sm" | "md" | "lg" | "xl"; // only used if labelText is defined
}

export const Datepicker = React.forwardRef<HTMLInputElement, DatepickerProps>(
  ({ datetime = false, className, labelText, labelSize = "md", id, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {labelText && ( 
          <Label htmlFor={id} size={labelSize}>
            {labelText}
          </Label>
        )}
        <Input
          id={id}
          type={datetime ? "datetime-local" : "date"} // can either display date or date-time 
          size="md"
          ref={ref}
          {...props} 
        />
      </div>
    );
  }
);

Datepicker.displayName = "Datepicker";
