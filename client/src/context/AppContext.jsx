import { createContext, useEffect, useState } from 'react';
import { Axios } from '../utils/Axiox';
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

  useEffect(() => {
    checkAuth();
  }, [refresh, location.pathname]); // Runs once on mount to check auth

  useEffect(() => {
    console.log('Updated state:', { user, isAuth, shop, isShopAuth });
  }, [user, isAuth, shop, isShopAuth, toggleMenu, ennableSearchbar, refresh]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
