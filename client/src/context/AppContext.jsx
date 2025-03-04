import { createContext, useEffect, useState } from 'react';
import { Axios } from '../utils/Axiox';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';


export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [isShopAuth, setIsShopAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null); // Initialize with null for clarity
  const [toggleMenu, setToggleMenu] = useState(true);
  const [ennableSearchbar, setEnnablesearchBar] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [refresh, setRefresh] = useState(false);
  const [cartCount, setCartcount] = useState(0)
  const [notification, setNotifications] = useState({})
  const [isadmin, setIsAdmin] = useState(false)
  const [selectedtab, setSelectedTab] = useState(0)
  const navigate = useNavigate();
  const location = useLocation();


  const checkAuth = async () => {
    try {
      if (location.pathname.startsWith('/shop')) {
        // If visiting a shop-related page, check shop authentication
        const { data } = await Axios.get('shop/shopviewauth');
        if (data.success) {
          setIsShopAuth(true);
          setShop(data.Shop);
        } else {
          setIsShopAuth(false);
          setShop(null);

        }
      } else {
        // Otherwise, check user authentication
        const { data } = await Axios.get('user/userViewAuth');
        if (data.success) {
          setIsAuth(true);
          setUser(data.User);
        } else {
          setIsAuth(false);
          setUser(null);
          navigate('/user/login')
        }
      }
    } catch (e) {
      // navigate('/user/login')
      console.error('Error during authentication check:', e);
    }
  };

  const Get_carty_count = async () => {
    try {
      const { data } = await Axios.get('/user/getCartCount');
      setCartcount(data.cartcount)
    } catch (error) {
      console.error('Error during authentication check:', error);
    }
  }

  const get_available_notification = async () => {
    try {
      const { data } = await Axios.get('/user/getUserNotifications')
      console.log("Notifications", data);
      if (data.success) {
        setNotifications(data.Notifications)
      }

    } catch (error) {
      console.error('Error during authentication check:', error);
    }
  }

  const CheckAdninAuth = async () => {
    try {
      const { data } = await Axios.get('/admin/adminAuth');
      console.log(data, "Addddddddddddddd");

      if (data.success) {
        setIsAdmin(true)
        console.log("Admin dataaaa", data);
      }
      else {
        navigate('/admin/login')
      }
    } catch (error) {
      navigate('/admin/login')
      console.log(Error);

    }
  }

  useEffect(() => {
    checkAuth();
    Get_carty_count()
    get_available_notification()
    CheckAdninAuth()
  }, [refresh,location.pathname]); // Runs once on mount to check auth

  useEffect(() => {
    console.log('Updated state:', { user, isAuth, shop, isShopAuth });
  }, [user, isAuth, shop, isShopAuth, toggleMenu, ennableSearchbar, refresh,isadmin]);


  const value = {
    name: 'vipin',
    isAuth,
    user,
    setUser,
    setIsAuth,
    shop,
    isShopAuth,
    setShop,
    setIsShopAuth,
    toggleMenu,
    setToggleMenu,
    ennableSearchbar,
    setEnnablesearchBar,
    activeTab,
    setActiveTab,
    refresh,
    setRefresh,
    cartCount,
    setCartcount,
    notification,
    setNotifications,
    isadmin,
    setIsAdmin,
    selectedtab,
    setSelectedTab

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
