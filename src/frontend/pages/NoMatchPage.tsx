import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { ErrorDisplay } from '../../libs/ui/components';
import icon_boom from '../../libs/ui/assets/icon_boom.png';
import { useTranslation } from '../../libs/hooks';

const NoMatchPage: React.FC = () => {
  const t = useTranslation("pages.no_match");
  return (
    <BaseLayout bordered={true}>
      <ErrorDisplay image={icon_boom} code={404} message={t("no_match")}>
        <p>{t("message")}</p>
      </ErrorDisplay>
    </BaseLayout>
  );
};

export default NoMatchPage;
