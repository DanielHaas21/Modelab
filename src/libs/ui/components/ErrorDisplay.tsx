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

/**
 * A component for displaying error messages in a user-friendly format.
 */
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
        'flex flex-col justify-center items-center w-full h-full p-8 text-center',
        className
      )}
      {...props}
    >
      {image !== undefined && (
        <div className="w-24 aspect-square mb-6 opacity-80">
          <img src={image} className="w-full h-full object-contain" alt="error icon" />
        </div>
      )}
      <h1 className="tracking-[0.5rem] text-7xl font-light text-accent-500 mb-2">{code}</h1>
      <Label size={'sm'} className="font-medium text-text-950 mb-4 tracking-wide uppercase">
        {message}
      </Label>
      <div className="text-text-500 font-light max-w-md">
        {children}
      </div>
    </div>
  );
};
