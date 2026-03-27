import * as React from 'react';
import { BaseLayout } from '../../../libs/ui/layouts';
import { useTitle } from '../../../libs/hooks';
import { AdminPanelContext } from '../../../middleware/types/actions/adminPanel';
import { loadAdminPanelContext } from '../../../middleware/actions/loadAdminPanelContext';
import { Label, Preloader } from '../../../libs/ui/components';

const AdminPanel: React.FC = () => {
  useTitle({ type: 'name', name: 'Admin Panel' });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [adminPanelContext, setAdminPanelContext] = React.useState<AdminPanelContext | null>(null);

  // load context
  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const context = await loadAdminPanelContext();
        setAdminPanelContext(context);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading || adminPanelContext === null) return <Preloader className="min-h-screen" />;

  return (
    <BaseLayout bordered={true}>
      <Label>Admin Panel</Label>
      <Label>Health: {JSON.stringify(adminPanelContext.health)}</Label>
    </BaseLayout>
  );
};

export default AdminPanel;
