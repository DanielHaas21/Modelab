import * as React from 'react';
import { cn } from '../../utils';
import { Label, LabelVariants } from './Label';

interface ScrollLabelProps extends LabelVariants {
  className?: string;
  children?: React.ReactNode;
}

/**
 * A component that displays a label which scrolls horizontally if its content exceeds the width of its container.
 * @param props
 * @returns 
 */
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
    <div ref={containerRef} className={cn('scroll-label', className)}>
      {isScrollable ? (
        <>
          <Label {...props} ref={labelRef} className={cn('pe-4 mb-0 scrollable')}>
            {children}
          </Label>
          <Label {...props} className={cn('pe-4 mb-0 scrollable')}>
            {children}
          </Label>
        </>
      ) : (
        <Label {...props} ref={labelRef} className={cn('mb-0')}>
          {children}
        </Label>
      )}
    </div>
  );
};
