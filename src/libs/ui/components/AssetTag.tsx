import * as React from 'react';

interface AssetTagProps {
  name: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

export const AssetTag = React.forwardRef<HTMLDivElement, AssetTagProps>(
  ({ name, onClose }, ref) => {
    return (
      <span
        ref={ref}
        className="model-tag rounded-2 border border-dark-subtle small me-2 mb-1"
        style={{
          padding: '2px 8px',
        }}
      >
        {name}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="ms-2 btn-close small"
            aria-label="Close"
          ></button>
        )}
      </span>
    );
  }
);
