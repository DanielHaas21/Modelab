import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { ErrorDisplay } from '../../libs/ui/components';
import icon_boom from '../../libs/ui/assets/icon_boom.png';

const NoMatchPage: React.FC = () => {
  return (
    <BaseLayout bordered={true}>
      <ErrorDisplay image={icon_boom} code={404} message="Oops! Page not found">
        <p>The page you're looking for doesn't exist or has been moved.</p>
      </ErrorDisplay>
    </BaseLayout>
  );
};

export default NoMatchPage;
