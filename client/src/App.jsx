import { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import './index.css';
import ShopHome from './components/shops/Home.jsx';
import ShopLogin from './components/shops/login.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserSignUp from './components/users/signUp.jsx';
import UserLogin from './components/users/login.jsx';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './components/Admin/login.jsx';
import AcceptShops from './components/Admin/AcceptShops.jsx';
import ViewCart from './components/users/ViewCart.jsx';
import { CartContextProvider } from './context/Search&CartContext.jsx';
import UserBasePage from './components/users/UserBasePage.jsx';
import Profile_page from './components/users/Profile_page.jsx';
import UserHome from './components/users/UserHome.jsx';
import View_orders from './components/users/View_orders.jsx';
import { ProductContextProvider } from './context/ProductContext.jsx';
import Wishlist_page from './components/users/Wishlist_page.jsx';
import Product_page from './components/users/Product_page.jsx';

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

        <Route path="/user/signup" element={isAuth ? <Navigate to="/user/home" /> : <UserSignUp />} />
        <Route path="/user/login" element={isAuth ? <Navigate to="/user/home" /> : <UserLogin />} />

        <Route path='/user' element={<ProductContextProvider> <UserBasePage /> </ProductContextProvider>}>
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/user/profile" element={<Profile_page />} />
          <Route path="/user/orders" element={<View_orders />} />
          <Route path="/user/viewCart" element={<CartContextProvider> <ViewCart /> </CartContextProvider>} />
          <Route path="/user/wishlist" element={<Wishlist_page />} />
          <Route path='/user/viewProduct/:proId' element={<Product_page />} />
        </Route>



        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accpet-shops" element={<AcceptShops />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
