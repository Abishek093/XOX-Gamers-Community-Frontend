import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../Slices/userSlice/userSlice';

const Navbar = () => {
  const user = useAppSelector(selectUser);
  // console.log(user,"user in navbar")
  return (
    <div className=" grid bg-white text-gray-900 flex justify-end p-4 drop-shadow-md h-12 sticky top-0 z-10 ">
      {/* <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="bg-white w-60 text-gray-900 px-2 py-1 rounded focus:outline-none drop-shadow-md"
        />
        <FaSearch className="ml-2" />
      </div> */}
      <div className="flex items-center">
        <FaUserCircle className="mr-4" />
        <div>HI, {user?.username || 'User'}</div>
      </div>
    </div>
  );
};

export default Navbar;
