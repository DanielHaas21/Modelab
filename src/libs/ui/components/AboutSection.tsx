import React from 'react';
import { Label } from './Label';

interface AboutSectionProps {
  title: string;
  children: string;
}

export const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ title, children }, ref) => {
    return (
      <section ref={ref} className="mb-10">
        <Label size={'xs'} className="block mb-2 font-medium tracking-wide uppercase">{title}</Label>
        <p className="kanit-light text-lg text-text-700 max-w-2xl leading-relaxed">{children}</p>
      </section>
    );
  }
);
