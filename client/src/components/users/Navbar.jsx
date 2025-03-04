import React, { useContext } from 'react';
import { SearchContextProvide } from '../../context/Search&CartContext';
import Searchproducts from './Search';
import { ArrowBigRight, Bell, Menu, Moon, Sun, SunDim, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { toggleMenu, setToggleMenu, ennableSearchbar, isAuth, user, notification } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className=" fixed w-full z-10">
      <div className="flex items-center justify-between py-1 px-5  w-full ">
        
        {/* Menu Button & Logo */}
        <div className="flex items-center justify-start gap-3.5 ">
          <button className="hover:bg-gray-100 rounded-full">
            <Menu className="h-auto w-6 text-gray-600" onClick={() => setToggleMenu(!toggleMenu)} />
          </button>
          <div className="h-16 flex flex-col sm:justify-end justify-center">
            <h2 className=" sm:text-2xl text-sm font-bold text-gray-900 ">GizmoLocate</h2>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/user/settings')}>
              <p className="sm:text-[12px] text-[8px] text-red-700">{user?.locationName}</p>
              <ArrowBigRight className="w-3 h-3 text-red-700" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-[50%] ">
          {ennableSearchbar && (
            <SearchContextProvide>
              <Searchproducts />
            </SearchContextProvide>
          )}
        </div>

        {/* Notifications & User Icon */}
        <div className="flex items-center space-x-4 ">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <div onClick={() => navigate('/user/viewNotification')}>
              <Bell className="h-6 w-6 text-gray-600" />
              {notification?.isViewed && (
                <div className="bg-red-600 absolute top-1 right-1 rounded-full w-4 h-4 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              )}
            </div>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Sun className="h-6 w-6 text-gray-600" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
