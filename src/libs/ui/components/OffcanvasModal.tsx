import * as React from 'react';
import Offcanvas from 'bootstrap/js/dist/offcanvas';

interface OffcanvasProps {
  title: string;
  children?: React.ReactNode;
}

export interface OffcanvasHandle {
  open: () => void;
  close: () => void;
}

export const OffcanvasModal = React.forwardRef<OffcanvasHandle, OffcanvasProps>(
  ({ title, children, ...props }, ref) => {
    const offcanvasRef = React.useRef<HTMLDivElement>(null);
    const offcanvasInstanceRef = React.useRef<Offcanvas | null>(null);

    React.useImperativeHandle(ref, () => ({
      open: () => {
        if (!offcanvasRef.current) return;

        if (!offcanvasInstanceRef.current) {
          offcanvasInstanceRef.current = new Offcanvas(offcanvasRef.current);
        }

        offcanvasInstanceRef.current?.show();
      },
      close: () => {
        offcanvasInstanceRef.current?.hide();
      },
    }));

    return (
      <div {...props} ref={offcanvasRef} className="offcanvas offcanvas-bottom offcanvas-fullscreen" tabIndex={-1} >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">{title}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          {children}
        </div>
      </div>
    );
  }
);
