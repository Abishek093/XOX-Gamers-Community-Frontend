import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppSelector } from '../../store/hooks';
import { selectAdmin } from '../../Slices/adminSlice/adminSlice';

const AdminPublicRoute: React.FC = () => {
  const admin = useAppSelector(selectAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    const adminAccessToken = Cookies.get('AdminAccessToken');
    const adminRefreshToken = Cookies.get('AdminRefreshToken');

    if (admin || (adminAccessToken && adminRefreshToken)) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  return !admin ? <Outlet /> : null;
};

export default AdminPublicRoute;