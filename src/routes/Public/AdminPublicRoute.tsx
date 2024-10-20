import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectAdmin } from '../../Slices/adminSlice/adminSlice';

const AdminPublicRoute: React.FC = () => {
  const admin = useAppSelector(selectAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  return admin ? <Outlet /> : null;
};

export default AdminPublicRoute;