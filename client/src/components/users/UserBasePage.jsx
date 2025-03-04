import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import Navbar from './Navbar.jsx';
import Profile_page from './Profile_page.jsx';
import User_Sidebar from './sidebar.jsx';
import { Outlet } from 'react-router-dom';

const UserBasePage = () => {
  const { toggleMenu } = useContext(AppContext);

  return (
    <div className="max-h-screen flex fixed w-full">
      <main className="flex-1">
        <Navbar />
        <div className="flex pt-20 max-h-screen">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${toggleMenu ? 'w-48 md:w-[200px]' : 'w-16 md:w-16'}`}>
            <User_Sidebar />
          </div>

          {/* Main Content */}
          <div className={` ${toggleMenu ? 'w-[88%] md:w-[96%]' : 'w-[96%] md:w-[98%]'} h-screen overflow-y-scroll bg-gray-100 hide-scrollbar`}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserBasePage;
