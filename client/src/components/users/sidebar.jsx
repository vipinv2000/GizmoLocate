import { useContext, useState } from 'react';
import { Heart, Home, LogOut, Package, Settings, ShoppingCart, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const User_Sidebar = () => {
    const { toggleMenu, activeTab, setActiveTab, cartCount } = useContext(AppContext)
    const navigate = useNavigate()

    return (
        <div className="w-full relative h-full transition-all duration-300  shadow-md ">

            <nav className="">
                {[
                    { name: 'Home', icon: Home, id: 'home', path: '/user/home' },
                    { name: 'Profile', icon: User, id: 'profile', path: '/user/profile' },
                    { name: 'Orders', icon: Package, id: 'orders', path: '/user/orders' },
                    { name: 'Wishlist', icon: Heart, id: 'wishlist', path: '/user/wishlist' },
                    { name: 'Cart', icon: ShoppingCart, id: 'cart', path: '/user/viewCart' },
                    { name: 'Settings', icon: Settings, id: 'settings', path: '/user/settings' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id)
                            navigate(item.path)
                        }}
                        className={` w-full flex items-center ${!toggleMenu && ` justify-center`} px-6 py-3 text-gray-700  hover:bg-gray-100 ${activeTab === item.id ? 'bg-gray-100 text-black font-medium' : ''
                            }`}
                    >
                        <item.icon className={`h-5 w-5  ${toggleMenu && ` mr-3 `}`} />
                        {
                            toggleMenu && item.name
                        }
                        {
                            item.id == "cart" && toggleMenu && <div className='text-sm text-white font-extrabold ml-2 bg-red-700 opacity-70 rounded-full px-2'>
                                 <p>{cartCount == 0 ? " " : cartCount}</p>
                            </div>
                        }
                    </button>
                ))}
            </nav>
            <div className={`absolute bottom-6 w-full ${toggleMenu ? "px-6" : "px-5"}  pb-4 `}>
                <button className={`bg- w-full flex items-center ${!toggleMenu && 'justify-center'} text-gray-700 hover:text-black`}>
                    <LogOut className=" mr-2" />
                    {
                        toggleMenu && "Logout"
                    }

                </button>
            </div>
        </div>
    );
};

export default User_Sidebar;
