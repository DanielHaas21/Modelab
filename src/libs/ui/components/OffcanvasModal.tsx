import * as React from 'react';

interface OffcanvasProps {
  title: string;
  children?: React.ReactNode;
}

export interface OffcanvasHandle {
  open: () => void;
  close: () => void;
}

/**
 * A component that renders an offcanvas modal, which slides in from the bottom of the screen. 
 */
export const OffcanvasModal = React.forwardRef<OffcanvasHandle, OffcanvasProps>(
  ({ title, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      },
      close: () => {
        setIsOpen(false);
        document.body.style.overflow = '';
      },
    }));

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-bg-50 animate-in slide-in-from-bottom duration-300"
        {...props}
      >
        <div className="flex items-center justify-between p-4 border-b border-ui-border">
          <h5 className="text-xl font-semibold font-normal">{title}</h5>
          <button
            type="button"
            className="p-2 text-2xl leading-none hover:opacity-70 transition-opacity"
            onClick={() => {
              setIsOpen(false);
              document.body.style.overflow = '';
            }}
          >
            ×
          </button>
        </div>
        <div className="grow overflow-auto p-4">
          {children}
        </div>
      </div>
    );
  }
);
