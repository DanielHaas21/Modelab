import * as React from 'react';
import { Label } from './Label';

interface BrowserFiltersProps {}

export const BrowserFilters = React.forwardRef<HTMLDivElement, BrowserFiltersProps>(({}, ref) => {
  return (
    <aside className="col-xl-2 col-4 d-flex flex-column">
      <div className="w-100">
        <Label size="xs">Category</Label>
        <div className="w-100">
          <span className="mr-1">3D Model</span>
          <span className="mr-1">2D Texture</span>
          <span className="mr-1">Audio</span>
        </div>
      </div>
    </aside>
  );
});
