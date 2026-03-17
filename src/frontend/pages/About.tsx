import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Label } from '../../libs/ui/components';
import { AboutSection } from '../../libs/ui/components/AboutSection';
import { cn } from '../../libs/utils';
import { useResponsive, useTranslation } from '../../libs/hooks';

const About: React.FC = () => {
  const t = useTranslation("pages.about");

  const { isDesktop } = useResponsive();

  return (
    <BaseLayout bordered={true}>
      <main className={cn("pt-10 overflow-y-auto custom-scrollbar", isDesktop ? "ps-8" : "px-2")}>
        <Label size={'md'}>{t("about")}</Label>
        <div className="ps-2">
          <AboutSection title={t("whatIsModelab")}>
            {t("info")}
          </AboutSection>
          <AboutSection title={t("whoIsModelabFor")}>
            {t("offer")}
          </AboutSection>
          <AboutSection title={t("howToCredit")}>{t("noNeed")}</AboutSection>
        </div>
      </main>
    </BaseLayout>
  );
};

export default About;
