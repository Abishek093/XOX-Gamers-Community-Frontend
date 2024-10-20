import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';
import { LoadingProvider } from './context/LoadingContext';
// import SocketProvider from './services/userServices/socketProvider';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Move Provider to wrap SocketProvider */}
      <PersistGate loading={null} persistor={persistor}>
        {/* <SocketProvider> SocketProvider inside Redux context */}
          <LoadingProvider>
            <Toaster position="top-center" richColors />
            <App />
          </LoadingProvider>
        {/* </SocketProvider> */}
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
