import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoMatchPage from '../pages/NoMatchPage';
import { ADMIN_ROUTES } from '../../global/routes';
import Login from '../pages/admin/Login';
import AdminPanel from '../pages/admin/AdminPanel';

// import AdminPanel from './../pages/admin/AdminPanel';

/**
 * There should be no active HTML in this component, only wrapping of providers, routers etc.
 */
const AdminRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={ADMIN_ROUTES.Login} element={<Login />} />
      {/*
      <Route path={ADMIN_ROUTES.Users} element={<AdminPanel />} />
      <Route path={ADMIN_ROUTES.Assets} element={<AdminPanel />} /> */}
      <Route path="*" element={<NoMatchPage />} />
      <Route path={ADMIN_ROUTES.Panel} element={<AdminPanel />} />
    </Routes>
  );
};

export default AdminRouter;
