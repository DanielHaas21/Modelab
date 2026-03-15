import * as React from 'react';
import { cn } from '../../utils';

interface PreloaderProps {
  className?: string;
}

/**
 * A component that displays a preloader animation while content is loading.
 * @param props The props for the Preloader component.
 * @returns 
 */
export const Preloader: React.FC<PreloaderProps> = ({ className, ...props }) => {
  const dots = [...Array(5)].map((_, i) => (
    <div
      key={i}
      className="w-4 h-4 rounded-full bg-primary-500 animate-spinner-grow"
      style={{ animationDelay: `${i * 0.15}s` }}
    />
  ));
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center w-full h-full animate-in fade-in duration-700',
        className
      )}
      {...props}
    >
      <h1 className="tracking-[0.3rem] text-5xl font-light text-text-950">Modelab</h1>
      <div className="flex flex-row space-x-2 mt-6">
        {dots}
      </div>
    </div>
  );
};
