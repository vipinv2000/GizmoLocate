import { createContext, useEffect, useState } from 'react';
import { Axios } from '../utils/Axiox';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null); // Initialize with null for clarity
  const [toggleMenu, setToggleMenu] = useState(true)
  const [ennableSearchbar, setEnnablesearchBar] = useState(false)
  const [activeTab, setActiveTab] = useState('home');
  const [refresh, setRefresh] = useState(false);
  const [cartCount, setCartcount] = useState(0)
  const [notification, setNotifications] = useState({})

  const navigate = useNavigate()

  const checkAuth = async () => {
    try {
      const { data } = await Axios.get('user/userViewAuth');
      console.log('fefgerfg', data);

      if (data.success) {
        setIsAuth(true);
        setUser(data.User);
      }
    } catch (e) {
      navigate('/user/login')
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

  useEffect(() => {
    checkAuth();
    Get_carty_count()
    get_available_notification()
  }, [refresh]); // Runs once on mount to check auth

  // This useEffect will log updated values of `user` and `isAuth`
  useEffect(() => {
    console.log('Updated state:', { user, isAuth });
  }, [user, isAuth, toggleMenu, ennableSearchbar, refresh]);

  const value = {
    name: 'vipin',
    isAuth,
    user,
    setUser,
    setIsAuth,
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
    setNotifications
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
