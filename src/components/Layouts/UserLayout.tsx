// import React, { useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import UserSidebar from '../User/common/UserSidebar';
// import UserNavbar from '../User/common/UserNavbar';
// import { selectUser } from '../../Slices/userSlice/userSlice';
// import { useAppSelector } from '../../store/hooks';

// const UserLayout: React.FC = () => {
//   const user = useAppSelector(selectUser);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   return (
//     <div className="flex">
//       <UserSidebar />
//       <div className="flex-1 flex flex-col">
//         <UserNavbar />
//         <div className="p-4 bg-gray-100 flex-1 overflow-y-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

  // export default UserLayout;
  import React, { useEffect } from 'react';
  import { Outlet, useNavigate, useLocation } from 'react-router-dom';
  import UserSidebar from '../User/common/UserSidebar';
  import UserNavbar from '../User/common/UserNavbar';
  import { selectUser } from '../../Slices/userSlice/userSlice';
  import { useAppSelector } from '../../store/hooks';

  const UserLayout: React.FC = () => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    const isChatPage = location.pathname === "/chats";

    return (
      <div className="flex">
        <UserSidebar iconsOnly={isChatPage} />
        <div className={`flex-1 flex flex-col ${isChatPage ? '' : 'with-navbar'}`}>
          {!isChatPage && <UserNavbar />}
          <div className="p-4 bg-gray-100 flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  export default UserLayout;
