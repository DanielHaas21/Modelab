import * as React from 'react';
import { cn } from '../../utils';

interface PopupProps {
  className?: string;
  text: string;
  isDeclinable?: boolean;
}

export const GeneralPopup = React.forwardRef<HTMLDivElement, PopupProps>(
  ({ className, text, isDeclinable, ...props }, ref) => {
    return (
      <div>
        <div></div>
      </div>
    );
  }
);
