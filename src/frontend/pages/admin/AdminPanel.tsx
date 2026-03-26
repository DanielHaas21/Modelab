import * as React from 'react';
import { BaseLayout } from '../../../libs/ui/layouts';
import { useTitle } from '../../../libs/hooks';

const AdminPanel: React.FC = () => {
  useTitle({ type: 'name', name: 'Admin Panel' });

  return (
    <BaseLayout bordered={true}>
      <p>Admin Panel</p>
    </BaseLayout>
  );
};

export default AdminPanel;
