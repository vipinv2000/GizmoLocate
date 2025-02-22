import { createContext, useEffect, useState } from 'react';
import { Axios } from '../utils/Axiox';

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null); // Initialize with null for clarity

  const checkAuth = async () => {
    try {
      const { data } = await Axios.get('user/userViewAuth');
      console.log('fefgerfg',data);

      if (data.success) {
        setIsAuth(true);
        setUser(data.User);
      }
    } catch (e) {
      console.error('Error during authentication check:', e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []); // Runs once on mount to check auth

  // This useEffect will log updated values of `user` and `isAuth`
  useEffect(() => {
    console.log('Updated state:', { user, isAuth });
  }, [user, isAuth]);

  const value = {
    name: 'vipin',
    isAuth,
    user,
    setUser,
    setIsAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
