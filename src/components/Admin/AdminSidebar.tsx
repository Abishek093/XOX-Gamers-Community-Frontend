import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaFlag, FaAd } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 h-screen">
      <div className="text-3xl font-bold mb-10 text-center">XOX</div>
      <nav>
        <ul>
          <li className="mb-6">
            <Link
              to="/admin/dashboard"
              className={`text-lg flex items-center space-x-3 transition-all duration-200 hover:text-gray-300 ${isActive('/admin/dashboard') ? 'text-blue-500' : ''}`}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="mb-6">
            <Link
              to="/admin/reports"
              className={`text-lg flex items-center space-x-3 transition-all duration-200 hover:text-gray-300 ${isActive('/admin/reports') ? 'text-blue-500' : ''}`}
            >
              <FaFlag />
              <span>Reports</span>
            </Link>
          </li>
          <li className="mb-6">
            <Link
              to="/admin/sponsored-posts"
              className={`text-lg flex items-center space-x-3 transition-all duration-200 hover:text-gray-300 ${isActive('/admin/sponsored-posts') ? 'text-blue-500' : ''}`}
            >
              <FaAd />
              <span>Sponsored Posts</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;