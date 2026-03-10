import * as React from 'react';
import { cn } from '../../utils';
import { Label, LabelVariants } from './Label';

interface ScrollLabelProps extends LabelVariants {
  className?: string;
  children?: React.ReactNode;
}

export const ScrollLabel: React.FC<ScrollLabelProps> = ({ className, children, ...props }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    const label = labelRef.current;

    if (!container || !label) return;

    const checkScroll = () => {
      setIsScrollable(label.scrollWidth > container.clientWidth);
    };

    checkScroll();

    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden w-full flex items-center', className)}>
      <div className={cn(isScrollable ? 'animate-scroll-label' : 'w-full')}>
        <Label {...props} ref={labelRef} className={cn('pr-8 whitespace-nowrap mb-0 block')}>
          {children}
        </Label>
        {isScrollable && (
          <Label {...props} className={cn('pr-8 whitespace-nowrap mb-0 block')}>
            {children}
          </Label>
        )}
      </div>
    </div>
  );
};
