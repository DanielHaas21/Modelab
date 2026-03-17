import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoMatchPage from '../NoMatchPage';
// import { AdminRoutes } from '../../../global/BrowserRoutes';
// import AdminPanel from './AdminPanel';

/**
 * There should be no active HTML in this component, only wrapping of providers, routers etc.
 */
const AdminRouter: React.FC = () => {
  return (
    <Routes>
      {/* <Route path={AdminRoutes.Panel} element={<AdminPanel />} />
      <Route path={AdminRoutes.Login} element={<AdminPanel />} />
      <Route path={AdminRoutes.Users} element={<AdminPanel />} />
      <Route path={AdminRoutes.Assets} element={<AdminPanel />} /> */}
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
};

export default AdminRouter;
