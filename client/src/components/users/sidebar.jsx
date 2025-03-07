import { useContext, useState } from 'react';
import { Heart, Home, LogOut, Package, Settings, ShoppingCart, User } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../../utils/Axiox';
import toast from 'react-hot-toast';

const User_Sidebar = () => {

    const { toggleMenu, activeTab, setActiveTab, setIsAuth, setUser, cartCount, dark } = useContext(AppContext)
    const navigate = useNavigate()
    const logoutsession = async () => {
        await Axios.post('/user/logout')
        setIsAuth(false);
        setUser(null);
        navigate('/user/login')
        toast.success("Loggedout Successfully")
    }
    return (
        <div className={`w-full pl-2 relative h-full   p-1  ${dark ? "bg-[#0F0F0F] " : "shadow-xl "}  `}>

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
                            setActiveTab(item.id);
                            navigate(item.path);
                        }}
                        className={`${dark ? "hover:bg-[#141414] text-white rounded-xl" : "hover:bg-gray-100 rounded-xl"} w-full flex items-center ${!toggleMenu ? " justify-center" : ""
                            } px-4 py-3 text-gray-700 ${activeTab === item.id
                                ? dark
                                    ? " text-white font-medium rounded-xl"
                                    : "bg-gray-100 text-black font-medium rounded-xl"
                                : ""
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

            <div className={`absolute bottom-6 w-full ${toggleMenu && "px-6"}  flex items-center justify-center`}>
                <button onClick={logoutsession} className={`${dark ? "text-white" :"text-black"} w-full flex items-center ${!toggleMenu && 'justify-center'} ${dark ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"} `}>
                    <LogOut className="h-5 sm:w-5 w-20 mr-3" />

                    {
                        toggleMenu && "Logout"
                    }

                </button>
            </div>
        </div>
    );
};

export default User_Sidebar;
