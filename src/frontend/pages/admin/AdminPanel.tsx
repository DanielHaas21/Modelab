import * as React from 'react';
import { BaseLayout } from '../../../libs/ui/layouts';
import { useTitle } from '../../../libs/hooks';
import { AdminPanelContext } from '../../../middleware/types/actions/adminPanel';
import { loadAdminPanelContext } from '../../../middleware/actions/loadAdminPanelContext';
import { Label, Preloader } from '../../../libs/ui/components';

interface AdminPanelProps {
  context: AdminPanelContext;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ context }) => {
  useTitle({ type: 'name', name: 'Admin Panel' });


  return (
    <BaseLayout bordered={true}>
      <Label>Admin Panel</Label>
      <Label>Health: {JSON.stringify(context.health)}</Label>
    </BaseLayout>
  );
};

const AdminPanelLoader: React.FC = () => {
  const [context, setContext] = React.useState<AdminPanelContext | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const context = await loadAdminPanelContext();
        setContext(context);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
    })();
  }, []);

  if (context === null) return <Preloader className="min-h-screen" />;

  return (
    <AdminPanel
      context={context}
    />
  );
};

export default AdminPanelLoader;
