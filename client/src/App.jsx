import { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import './index.css';
import ShopHome from './components/shops/Home.jsx';
import ShopLogin from './components/shops/login.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserSignUp from './components/users/signUp.jsx';
import UserLogin from './components/users/login.jsx';
import { Toaster } from 'react-hot-toast';
import UserHome from './components/users/UserHome.jsx';
import AdminLogin from './components/Admin/login.jsx';
import AcceptShops from './components/Admin/AcceptShops.jsx';

// Usage
const App = () => {
  const { name, user, isAuth } = useContext(AppContext);
  console.log(isAuth);

  return (
    <>
      <Routes>
        <Route path="/" element={<ShopHome />} />
        <Route
          path="/shop/login"
          element={isAuth ? <Navigate to="/" /> : <ShopLogin />}
        />
        {/* <Route path="/user/signup"element={isAuth ? <Navigate to="/" /> : <UserSignUp />} /> */}
        <Route path="/user/signup"element={isAuth ? <Navigate to="/user/home" /> : <UserSignUp />} /> 
        <Route path="/user/login"element={isAuth ? <Navigate to="/user/home" /> : <UserLogin />} /> 
        <Route path="/user/home"element={ <UserHome />} />
        <Route path="/admin/login"element={ <AdminLogin />} />
        <Route path="/admin/accpet-shops"element={ <AcceptShops />} />
      </Routes>
      <Toaster/>
    </>
  );
};

export default App;
