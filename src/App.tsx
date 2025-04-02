import * as React from 'react';
import './frontend/styles/export.scss';
import LandingPage from './frontend/pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Browser from './frontend/pages/Browser';
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
          </Routes>
        </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
