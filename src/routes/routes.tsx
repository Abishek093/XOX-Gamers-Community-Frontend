// import { createBrowserRouter } from 'react-router-dom';
// import UserLayout from '../components/Layouts/UserLayout';
// import AdminLayout from '../components/Layouts/AdminLayout';
// import { userRoutes, userPublicRoutes } from './UserRoutes';
// import { adminRoutes, adminPublicRoutes } from './AdminRoutes';
// import PublicRoute from './Public/UserPublicRoutes';
// // import AdminPublicRoute from './Public/AdminPublicRoute';
// import PrivateRoute from './Protected/UserProtectedRoutes';
// // import AdminPrivateRoute from './Protected/AdminProtectedRoutes';

// const router = createBrowserRouter([
//   {
//     path: '/home',
//     element: <PublicRoute />,
//     children: [
//       ...userPublicRoutes,
//     ],
//   },
//   {
//     path: '/admin',
//     // element: <AdminPublicRoute />,
//     children: [
//       ...adminPublicRoutes,
//     ],
//   },
//   {
//     path: '/',
//     element: <PrivateRoute />,
//     children: [
//       {
//         element: <UserLayout />,
//         children: userRoutes,
//       },
//     ],
//   },
//   {
//     path: '/admin',
//     // element: <AdminPrivateRoute />,
//     children: [
//       {
//         element: <AdminLayout />,
//         children: adminRoutes,
//       },
//     ],
//   },
// ]);

// export default router;
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '../components/Layouts/UserLayout';
import AdminLayout from '../components/Layouts/AdminLayout';
import { userRoutes, userPublicRoutes } from './UserRoutes';
import { adminRoutes, adminPublicRoutes } from './AdminRoutes';
import PublicRoute from './Public/UserPublicRoutes';
// import AdminPublicRoute from './Public/AdminPublicRoute';
import PrivateRoute from './Protected/UserProtectedRoutes';
import VideoCall from '../components/User/ChagPage/VideoCall';
// import AdminPrivateRoute from './Protected/AdminProtectedRoutes';

const router = createBrowserRouter([
  
  {
    path: "/chats/room/:userId",
    element:<VideoCall />
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <UserLayout />,
        children: userRoutes,
      },
    ],
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      ...userPublicRoutes,
    ],
  },
  {
    path: '/admin',
    // element: <AdminPublicRoute />,
    children: [
      ...adminPublicRoutes,
    ],
  },

  {
    path: '/admin',
    // element: <AdminPrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: adminRoutes,
      },
    ],
  },
]);

export default router;
