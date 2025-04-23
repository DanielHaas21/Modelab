import React from 'react';
import { Label } from './Label';

interface AboutSectionProps {
  title: string;
  children: string;
}

export const AboutSection = React.forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ title, children }, ref) => {
    return (
      <section ref={ref}>
        <Label size={'xs'}>{title}</Label>
        <p className="fw-light">{children}</p>
      </section>
    );
  }
);
