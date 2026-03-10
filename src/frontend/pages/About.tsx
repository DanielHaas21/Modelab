import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Label } from '../../libs/ui/components';
import { AboutSection } from '../../libs/ui/components/AboutSection';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';

/**
 * @TODO.md Add more info
 */
const About: React.FC = () => {
  const { isDesktop } = useResponsive();

  return (
    <BaseLayout bordered={true}>
      <main className={cn("w-100 h-100 pt-10 overflow-y-auto custom-scrollbar", isDesktop ? "ps-8" : "px-2")}>
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
        <Label size={'lg'} className="mt-8 mb-4">To-Do</Label>
        <ol className="ps-8 list-decimal kanit-light text-lg text-text-700 space-y-2 mb-10">
          <li>Migrate to tailwaind</li>
          <li>Full mobile support</li>
          <li>Frontend user pages Login + Signup + Admin Panel</li>
          <li>Backend user endpoints</li>
          <li>Refactor?</li>
        </ol>
      </main>
    </BaseLayout>
  );
};

export default About;
