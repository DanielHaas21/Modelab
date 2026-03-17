import * as React from 'react';
import LandingPage from './frontend/pages/LandingPage';
import Browser from './frontend/pages/Browser';
import About from './frontend/pages/About';
import ModelDetail from './frontend/pages/ModelDetail';
import ModelManage from './frontend/pages/ModelManage';
import NoMatchPage from './frontend/pages/NoMatchPage';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BrowserRoutes } from './global/BrowserRoutes';
import AdminRouter from './frontend/pages/admin/AdminRouter';

/**
 * There should be no active HTML in this component, only wrapping of providers, routers etc.
 */
function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={BrowserRoutes.LandingPage} element={<LandingPage />} />
        <Route path={BrowserRoutes.Browser} element={<Browser />} />
        <Route path={BrowserRoutes.About} element={<About />} />
        <Route path={BrowserRoutes.ModelDetail + ':modelId'} element={<ModelDetail />} />
        <Route path={BrowserRoutes.ModelManage + ':action'} element={<ModelManage />} />
        <Route path={BrowserRoutes.AdminRoot + '*'} element={<AdminRouter />} />
        <Route path="*" element={<NoMatchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
