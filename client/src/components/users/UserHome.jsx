import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ProductContext } from '../../context/ProductContext';
import Product_card from './Product_card';
import { assets } from '../../assets/assets';
import Button from './Button';

const UserHome = () => {
  const { setEnnablesearchBar, setToggleMenu, refresh, setRefresh, dark } =
    useContext(AppContext);
  const { showProducts } = useContext(ProductContext);

  useEffect(() => {
    setEnnablesearchBar(true);
    setToggleMenu(false);
    setRefresh(!refresh);
    return () => {
      setEnnablesearchBar(false);
      setToggleMenu(true);
    };
  }, []);

  return (
    <div
      className={`w-full min-h-screen ${
        dark ? 'bg-[#0F0F0F]' : 'bg-gray-50'
      } pt-0 p-6 mb-6`}
    >
      {/* Button Section */}
      <div className="h-auto w-full max-w-full overflow-x-hidden hide-scrollbar">
        <Button />
      </div>

      {/* Banner Section */}
      <div className="mt-4 relative rounded-xl w-full sm:h-[200px] h-[300px] bg-gradient-to-r from-[#0053d2] to-blue-300 shadow-lg">
        <div className="inset-0 h-full bg-opacity-50 flex flex-col sm:flex-row items-center sm:justify-between p-6 text-white rounded-xl">
          {/* Left Section (Text) */}
          <div className="flex flex-col justify-between h-full max-w-xl text-center sm:text-left">
            <div className="flex flex-col gap-3">
              <h1 className="text-xl sm:text-3xl font-extrabold leading-tight">
                Grab your favorite products today
              </h1>
              <p className="text-xs sm:text-sm font-medium">
                Get the Best Deals Now
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm mt-4">
                GizmoLocate helps users compare gadget prices and availability
                across multiple nearby stores.
              </p>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="flex justify-center items-center h-auto">
            <img
              className="h-[100px] sm:h-[200px] object-contain"
              src={assets.banner_Gif}
              alt="Banner"
            />
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="mt-1">
        {showProducts.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center py-12 ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 14h.01M12 16h.01M12 18h.01M12 20h.01M12 22h.01"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-sm text-center">
              We couldn't find any products matching your criteria. Try
              adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-14 ml-5 ">
            {showProducts.map(pro => (
              <div key={pro._id} className="flex sm:flex-row flex-col  items-center   ">
                
                <Product_card pro={pro} /> 
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
