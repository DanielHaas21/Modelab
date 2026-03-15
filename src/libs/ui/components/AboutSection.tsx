import React from 'react';
import { Label } from './Label';

interface AboutSectionProps {
  title: string;
  children: string;
}

/**
 * A section component for displaying information about a specific topic. It includes a title and a description.
 */
export const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ title, children }, ref) => {
    return (
      <section ref={ref} className="mb-10">
        <Label size={'xs'} className="block mb-2 font-medium tracking-wide uppercase">{title}</Label>
        <p className="font-light text-lg text-text-700 max-w-2xl leading-relaxed">{children}</p>
      </section>
    );
  }
);
