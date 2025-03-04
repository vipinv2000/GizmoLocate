import { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import './index.css';
import ShopHome from './components/shops/Home.jsx';
import ShopLogin from './components/shops/login.jsx';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
import Settings_page from './components/users/Settings_page.jsx';
import Notification_Page from './components/users/Notification_Page.jsx';
import ListShops from './components/Admin/ListShops.jsx';
import ListUsers from './components/Admin/ListUsers.jsx';
import Admin_root from './components/Admin/Admin_root.jsx';
import ShopSignUp from './components/shops/signUp.jsx';

const App = () => {
  const { name, user, isAuth, isadmin,isShopAuth } = useContext(AppContext);
  console.log(isAuth);
  return (
    <>
      <Routes>
        <Route path="/shop/home" element={<ShopHome />} />
        <Route
          path="/shop/signup"
          element={isShopAuth ? <Navigate to="/shop/home" /> : <ShopSignUp />}
        />
        <Route
          path="/shop/login"
          element={isShopAuth ? <Navigate to="/shop/home" /> : <ShopLogin />}
        />


        <Route
          path="/user/signup"
          element={isAuth ? <Navigate to="/user/home" /> : <UserSignUp />}
        />
        <Route
          path="/user/login"
          element={isAuth ? <Navigate to="/user/home" /> : <UserLogin />}
        />

        <Route path='/user' element={<ProductContextProvider> <UserBasePage /> </ProductContextProvider>}>
          {/* Default route when /user is accessed */}
          <Route index element={<UserHome />} />

          <Route path="home" element={<UserHome />} />
          <Route path="profile" element={<Profile_page />} />
          <Route path="orders" element={<View_orders />} />
          <Route path="viewCart" element={<CartContextProvider> <ViewCart /> </CartContextProvider>} />
          <Route path="wishlist" element={<Wishlist_page />} />
          <Route path="settings" element={<Settings_page />} />
          <Route path="viewProduct/:proId" element={<Product_page />} />
          <Route path="viewNotification" element={<Notification_Page />} />
        </Route>

        <Route path="/admin/login" element={isadmin ? <Navigate to="/admin" /> : <AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<Admin_root />}>
          <Route path="accept-shops" element={<AcceptShops />} />
          <Route path="view-shops" element={<ListShops />} />
          <Route path="view-users" element={<ListUsers />} />
        </Route>

      </Routes>
      <Toaster />
    </>
  );
};

export default App;
