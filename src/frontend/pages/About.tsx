import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Label } from '../../libs/ui/components';
import { AboutSection } from '../../libs/ui/components/AboutSection';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';
import { useTranslation } from '../../libs/ui/provider';

/**
 * @TODO.md Add more info
 */
const About: React.FC = () => {
  const { isDesktop } = useResponsive();
  const t = useTranslation("pages.about");

  return (
    <BaseLayout bordered={true}>
      <main className={cn("pt-10 overflow-y-auto custom-scrollbar", isDesktop ? "ps-8" : "px-2")}>
        <Label size={'md'}>{t("about")}</Label>
        <div className="ps-2">
          <AboutSection title="What is Modelab?">
            {t("info")}
          </AboutSection>
          <AboutSection title="Who is Modelab for?">
            {t("offer")}
          </AboutSection>
          <AboutSection title="How to credit?">No need</AboutSection>
        </div>
      </main>
    </BaseLayout>
  );
};

export default About;
