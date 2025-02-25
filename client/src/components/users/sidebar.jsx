import { useContext, useState } from 'react';
import { Heart, Home, LogOut, Package, Settings, ShoppingCart, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const User_Sidebar = () => {
    const { toggleMenu, activeTab, setActiveTab } = useContext(AppContext)
    const navigate = useNavigate()

    return (
        <div className="w-full relative h-full bg-white shadow-md ">

            <nav className="">
                {[
                    { name: 'Home', icon: Home, id: 'home', path: '/user/home' },
                    { name: 'Profile', icon: User, id: 'profile', path: '/user/profile' },
                    { name: 'Orders', icon: Package, id: 'orders', path: '/user/orders' },
                    { name: 'Wishlist', icon: Heart, id: 'wishlist', path: '/user/wishlist' },
                    { name: 'Cart', icon: ShoppingCart, id: 'cart', path: '/user/ViewCart' },
                    { name: 'Settings', icon: Settings, id: 'settings', path: '' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id)
                            navigate(item.path)
                        }}
                        className={`w-full flex items-center ${!toggleMenu && ` justify-center`} px-6 py-3 text-gray-700  hover:bg-gray-100 ${activeTab === item.id ? 'bg-gray-100 text-black font-medium' : ''
                            }`}
                    >
                        <item.icon className={`h-5 w-5  ${toggleMenu && ` mr-3`}`} />
                        {
                            toggleMenu && item.name
                        }

                    </button>
                ))}
            </nav>
            <div className="absolute bottom-6 w-full px-6 pb-4">
                <button className={`w-full flex items-center ${!toggleMenu && 'justify-center'} text-gray-700 hover:text-black`}>
                    <LogOut className="h-5 w-5 mr-3" />
                    {
                        toggleMenu && "Logout"
                    }

                </button>
            </div>
        </div>
    );
};

export default User_Sidebar;
