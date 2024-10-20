import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Admin/AdminSidebar";
import Navbar from "../Admin/AdminNavbar";

const AdminLayout: React.FC = () =>{
    return(
        <div className='flex'>
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-4 bg-gray-100 flex-1 p-12">
            <Outlet />
          </div>
        </div>
      </div>
    )
}

export default AdminLayout