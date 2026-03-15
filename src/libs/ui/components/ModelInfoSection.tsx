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
      <div ref={ref} className={cn('mt-4 flex flex-row items-baseline border-b border-ui-border/50 pb-2', className)}>
        <div className="w-1/3">
          <Label size="xxs" className="font-normal uppercase tracking-widest opacity-60">
            {name}
          </Label>
        </div>
        <div className="w-full sm:w-2/3 flex justify-start flex-wrap flex-row gap-2">{children}</div>
      </div>
    );
  }
);
