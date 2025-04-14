import * as React from 'react';
import './frontend/styles/export.scss';
import LandingPage from './frontend/pages/LandingPage';
import Browser from './frontend/pages/Browser';
import About from './frontend/pages/About';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

/**
 *
 * There should be no active HTML in this component, only wrapping of providers, routers etc.
 */
function App(): React.ReactElement {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Browser" element={<Browser />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
