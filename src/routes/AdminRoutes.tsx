
// import AdminLogin from '../../pages/admin/AdminLogin';
// import AdminDashboard from '../../pages/admin/AdminDashboard';

// const adminRoutes = [
//   {
//     path: 'admin/login',
//     element: <AdminLogin />,
//   },
//   {
//     path: 'admin/dashboard',
//     element: <AdminDashboard />,
//   },
// ];

// export default adminRoutes;
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ReportsPage from '../pages/admin/ReportsPage';
import SponsoredPosts from '../pages/admin/SponsoredPosts';

const adminRoutes = [
  {
    path: 'dashboard',
    element: <AdminDashboard />,
  },
  {
    path: 'reports',
    element: <ReportsPage />,
  },
  {
    path: 'sponsored-posts',
    element: <SponsoredPosts />
  }
];

const adminPublicRoutes = [
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
];

export { adminRoutes, adminPublicRoutes };
