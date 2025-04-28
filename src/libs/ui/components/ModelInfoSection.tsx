import React from 'react';
import { cn } from '../../utils';
import { Label } from './Label';

interface ModelInfoSectionProps {
  name: string;
  children?: React.ReactNode;
  className?: string;
}

export const ModelInfoSection = React.forwardRef<HTMLDivElement, ModelInfoSectionProps>(
  ({ name, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('mt-2', className, 'row')}>
        <div className="col">
          <Label size="xxs" className="kanit-regular">
            {name}
          </Label>
        </div>
        <div className="col-8 d-flex justify-content-start flex-wrap flex-row">{children}</div>
      </div>
    );
  }
);
