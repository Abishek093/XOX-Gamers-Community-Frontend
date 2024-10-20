// import React from 'react';
// import { RouterProvider } from 'react-router-dom';
// import router from './routes/routes';

// const App: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default App;
// App.tsx or a main layout component like `UserLayout` or `AdminLayout`


///
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import { useLoading } from './context/LoadingContext';
import LoadingPage from './components/Common/LoadingPage';

const App: React.FC = () => {
  const { loading } = useLoading(); 

  return (
    <>
      {loading && <LoadingPage />}
      <RouterProvider router={router} />
    </>
  );
};

export default App;


// ///
// import React, { useEffect } from 'react';
// import { RouterProvider } from 'react-router-dom';
// import router from './routes/routes';
// import { useLoading } from './context/LoadingContext';
// import LoadingPage from './components/Common/LoadingPage';
// import { webSocketService } from './services/userServices/websocketService'; 

// const App: React.FC = () => {
//   const { loading } = useLoading();

//   useEffect(() => {
//     // Initialize WebSocket connection
//     webSocketService;
//   }, []);

//   return (
//     <>
//       {loading && <LoadingPage />}
//       <RouterProvider router={router} />
//     </>
//   );
// };

// export default App;