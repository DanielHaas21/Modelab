import * as React from 'react';
import { cn } from '../../utils';

interface PreloaderProps {
  className?: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        { className },
        `d-flex flex-column 
            justify-content-center align-items-center
            w-100 h-100-vh fade-in
            `
      )}
      {...props}
    >
      <h1 className="lts-3 fs-9 kanit-light">Modelab</h1>
      <div className="d-flex flex-row preloader mt-3">
        <div className="spinner-grow bg-dark" role="status"></div>
        <div className="spinner-grow bg-dark" role="status"></div>
        <div className="spinner-grow bg-dark" role="status"></div>
        <div className="spinner-grow bg-dark" role="status"></div>
        <div className="spinner-grow bg-dark" role="status"></div>
      </div>
    </div>
  );
};
