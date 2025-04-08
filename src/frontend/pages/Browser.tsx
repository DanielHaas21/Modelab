import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
const Browser: React.FC = () => {
  return(
    <BaseLayout bordered={true}>
    <main className="w-100 min-h-86-vh"></main>
    </BaseLayout>
  );
};

export default Browser;
