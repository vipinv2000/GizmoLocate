import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ProductContext } from "../../context/ProductContext";
import Product_card from "./Product_card";
import { assets } from "../../assets/assets";
import Button from "./Button";

const UserHome = () => {
  const { setEnnablesearchBar, setToggleMenu, refresh, setRefresh } = useContext(AppContext);
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
    <div className="w-full min-h-screen bg-white  pt-0 p-6 mb-6">
      <div className=" h-auto w-full max-w-full overflow-x-hidden  hide-scrollbar ">
        <Button />
      </div>

      {/* Banner Section */}
      <div className="mt-4 relative rounded-xl w-full sm:h-[200px] h-[300px] bg-gradient-to-r from-[#0053d2] to-blue-300 shadow-md">
        <div className=" inset-0 h-full bg-opacity-50 flex flex-col sm:flex-row items-center sm:justify-between p-6 text-white rounded-xl">

          {/* Left Section (Text) */}
          <div className="flex flex-col justify-between h-full max-w-xl text-center sm:text-left">
            <div className="flex flex-col gap-3">
              <p className="text-xl sm:text-3xl font-extrabold">
                Grab your favorite products today
              </p>
              <p className="text-xs sm:text-sm">Get the Best Deals Now</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm">
                GizmoLocate helps users compare gadget prices and availability across multiple nearby stores.
              </p>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="flex justify-center items-center h-auto">
            <img className="h-[100px] sm:h-[150px]" src={assets.banner_Gif} alt="Banner" />
          </div>

        </div>
      </div>


      {/* Product Grid */}
      <div className="w-full flex flex-wrap justify-between grow gap-5 mt-6 mb-14">
        {showProducts.length === 0 ? (
          <div>
            <h1>No Product found</h1>
          </div>
        ) : (
          showProducts.map((pro) => (
            <>
              <Product_card key={pro._id} pro={pro} />

            </>
          ))
        )}
      </div>
    </div>
  );
};

export default UserHome;
