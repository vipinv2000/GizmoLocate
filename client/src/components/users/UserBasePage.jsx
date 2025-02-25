import React, { useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { useContext } from 'react';
import Navbar from './Navbar.jsx';
import Profile_page from './Profile_page.jsx';
import User_Sidebar from './sidebar.jsx';
import { Outlet } from 'react-router-dom';

const UserBasePage = () => {
  const {toggleMenu,setToggleMenu} = useContext(AppContext)

  return (
    <div className="max-h-screen  flex fixed w-full">
      <main className="flex-1 ">
        {/* Header */}
        <Navbar />

        <div className='flex pt-24  max-h-screen'>
          <div className={`${toggleMenu ? ' w-[12%]' : ' w-[4%]'}`}>
            <User_Sidebar />
          </div>
          <div className={`${toggleMenu ? ' w-[88%]' : ' w-[96%]'}  h-screen overflow-y-scroll bg-gray-100 hide-scrollbar`}>
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
};

export default UserBasePage;
