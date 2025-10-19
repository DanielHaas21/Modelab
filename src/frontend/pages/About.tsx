import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Label } from '../../libs/ui/components';
import { AboutSection } from '../../libs/ui/components/AboutSection';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';

/**
 * @todo Add more info
 */
const About: React.FC = () => {
  const { isDesktop } = useResponsive();

  return (
    <BaseLayout bordered={true}>
      <main className={cn("w-100 h-100", isDesktop ? "ps-8" : "px-2")}>
        <Label size={'md'}>About</Label>
        <div className="ps-2">
          <AboutSection title="What is Modelab?">
            Modelab is a database of models, textures and other assets that are made by students for
            students
          </AboutSection>
          <AboutSection title="Who is Modelab for?">
            Modelab offers 100% free assets for students working on games, websites, or school any
            other projects
          </AboutSection>
          <AboutSection title="How to credit?">No need</AboutSection>
        </div>
      </main>
    </BaseLayout>
  );
};

export default About;
