import * as React from 'react';
import { cn } from '../../utils';
import { Label } from './Label';

interface ErrorDisplayProps {
  className?: string;
  code: number;
  message: string;
  image?: string;
  children?: React.ReactNode;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  className,
  children,
  code,
  message,
  image,
  ...props
}) => {
  return (
    <div
      className={cn(
        className,
        `d-flex flex-column 
            justify-content-center align-items-center
            w-100 h-100
        `
      )}
      {...props}
    >
      {image !== undefined && (
        <div className="w-20 ratio ratio-1x1 mb-2">
          <img src={image} className="w-100 h-100" />
        </div>
      )}
      <h1 className="lts-4 fs-9 kanit-light">{code}</h1>
      <Label size={'xs'} className="kanit-light">
        {message}
      </Label>
      {children}
    </div>
  );
};
