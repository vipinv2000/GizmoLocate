import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "../../utils/Axiox";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { ShoppingBag } from "lucide-react";
import { IoCart } from "react-icons/io5";
import { MdOutlineHourglassEmpty } from "react-icons/md";

const Product_page = () => {
  const { proId } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);
  const { cartCount, setCartcount } = useContext(AppContext);

  const fetchSingleProduct = async () => {
    try {
      const { data } = await Axios.get(`/user/getSingleproduct/${proId}`);
      setSingleProduct(data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
  }, [proId]);

  const handleAddToCart = async (productId, shopId, pName) => {
    try {
      const { data } = await Axios.get(`/user/addCart/${productId}/${shopId}/${pName}`);
      toast.success(data.message);

      setSingleProduct((prev) => ({
        ...prev,
        quantity: prev.quantity - 1,
      }));
      setCartcount(cartCount + 1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  if (!singleProduct) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-600 font-semibold">Loading product details...</p>
      </div>
    );
  }
  //[#292f3f]
  return (
    <div className="w-full h-[98%]  flex items-center justify-center pb-8">
      <div className="w-[80%] h-[700px] bg-white p-16 rounded-xl shadow-xs" >
        <div className="w-full h-full bg- rounded-xl flex" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
          <div className="flex items-center justify-center w-[40%] h-full bg-gray-200 rounded-xl shadow-2xl" style={{ borderTopRightRadius: "50%", borderBottomRightRadius: "50%" }}
          >
            <img
              src={singleProduct.productimage}
              alt={singleProduct.productname}
              className="w-[80%] h-full object-contain "
              style={{ borderRadius: "900px" }}
            />
          </div>
          <div className="w-[60%] h-ful p-5 flex flex-col justify-around">
            <div className="w-full text-center">
              <p className="text-gray-500 text-[38px] font-extrabold">Product Details</p>

            </div>
            <div className="w-full  pl-5 flex flex-col gap-3.5">
              <p className="text-[15px] text-black italic">Model : {singleProduct.modelnumber}</p>
              <p className="text-[40px] text-black font-extrabold">{singleProduct.productname}</p>
              <div className="w-full flex gap-20">
                <p className="text-[25px] text-black font-extrabold">₹{singleProduct.price}</p>
                <p className="text-[25px] text-black font-semibold">{singleProduct.quantity > 0 ? `In Stock : ${singleProduct.quantity}` : "Sold Out"}</p>
              </div>
            </div>
            <div className="w-full  flex flex-col gap-3.5 pl-5">
              <p className="text-[15px] text-gray-400 italic " style={{
                fontSize: '13px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{singleProduct.description}</p>
              <div className="w-full flex gap-8">
                <p className="italic text-gray-500 text-sm font-extrabold">COLOR</p>
                <div className="flex gap-11">
                  <div className="w-[10px] p-3 bg-black rounded-full"> </div>
                  <div className="w-[10px] p-3 bg-gray-200 rounded-full"> </div>
                  <div className="w-[10px] p-3 bg-sky-300 rounded-full"> </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-evenly">
              <p className="text-lg font-semibold text-black flex gap-3"><ShoppingBag /> {singleProduct.shop.shopname}</p>
              <p
                onClick={() => handleAddToCart(singleProduct._id, singleProduct.shop._id, singleProduct.productname)}
                className={`text-lg  px-6 py-2 text-black font-semibold  transition 
              ${singleProduct.quantity > 0 ? "text-black hover:text-gray-500" : "text-gray-400 cursor-not-allowed"}`}
                disabled={singleProduct.quantity === 0}
              >
                {singleProduct.quantity > 0 ? (
                  <div className="flex  items-center gap-2.5 cursor-pointer">
                    <IoCart size={26} /> Add to Cart
                  </div>
                ) : (
                  <div className="flex  items-center gap-2.5">
                    <MdOutlineHourglassEmpty /> Sold Out
                  </div>
                )}

              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Product_page;
