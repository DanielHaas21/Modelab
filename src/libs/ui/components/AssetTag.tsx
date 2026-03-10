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
        className="inline-flex items-center px-2 py-0.5 rounded-md border border-ui-border text-xs mr-2 mb-1 bg-bg-200 text-text-700 font-medium tracking-tight"
      >
        {name}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="ml-2 hover:text-accent-500 cursor-pointer transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);
