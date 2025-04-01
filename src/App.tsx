import * as React from 'react';
import './frontend/styles/export.scss';
import LandingPage from './frontend/pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Browser from './frontend/pages/Browser';

function App() : React.ReactElement{
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Browser" element={<Browser />} />
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App;
