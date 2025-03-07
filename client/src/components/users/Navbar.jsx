import React, { useContext } from 'react';
import { SearchContextProvide } from '../../context/Search&CartContext';
import Searchproducts from './Search';
import { ArrowBigRight, Bell, Menu, Moon, Sun, SunDim, SunMoon, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { toggleMenu, setToggleMenu, ennableSearchbar, isAuth, user, notification, dark, setDark } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className={`fixed w-full z-10 ${dark ? "bg-[#0F0F0F] text-white" : "bg-white text-black"} `}>
      <div className="flex items-center justify-between py-1 px-5  w-full ">

        {/* Menu Button & Logo */}
        <div className="flex items-center justify-start gap-3.5 ">
          <button className={`p-2 rounded-full ${dark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}>
            <Menu className="h-auto w-6 " onClick={() => setToggleMenu(!toggleMenu)} />
          </button>
          <div className="h-16 flex flex-col sm:justify-end justify-center">
            <h2 className=" sm:text-2xl text-sm font-bold  cursor-pointer" onClick={()=>navigate('/user/home')}>GizmoLocate</h2>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/user/settings')}>
              <p style={{letterSpacing:"1px"}} className={`sm:text-[12px] text-[8px] ${dark ? "text-[#0053d2]" : "text-red-700"} `}>{user?.locationName}</p>
              <ArrowBigRight className={`w-3 h-3 ${dark ? "text-[#0053d2]" : "text-red-700"}`} />
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
          <button  className={`p-2 relative rounded-full ${dark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}>
            <div onClick={() => navigate('/user/viewNotification')}>
              <Bell className="h-6 w-6 " />
              {notification?.isViewed && (
                <div className="bg-red-700 absolute top-1 right-1 rounded-full w-4 h-4 flex items-center justify-center">
                  <span className="text-xs  font-bold">!</span>
                </div>
              )}
            </div>
          </button>
          <button className={`p-2 relative rounded-full ${dark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}>
            {
              dark ? <SunMoon className="h-6 w-6 " onClick={() => setDark(!dark)} /> : <Moon className="h-6 w-6 " onClick={() => setDark(!dark)} />
            }

          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
