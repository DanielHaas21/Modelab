import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import RootRouter from './frontend/routers/RootRouter';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  );
}

export default App;
