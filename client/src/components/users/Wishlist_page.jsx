import React, { useContext, useEffect, useState } from 'react';
import { Axios } from '../../utils/Axiox';
import { X } from 'lucide-react'; // Importing cross icon
import { ProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const WishlistPage = () => {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setwidhListToggle, wishlistToggle } = useContext(ProductContext);
  const {dark} = useContext(AppContext)
  const navigate = useNavigate()

  const fetchWishList = async () => {
    try {
      const { data } = await Axios.get('/user/mywishlist');
      console.log("Wish Item",data);
      
      setWishList(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await Axios.delete(`/user/removewishlist/${id}`); // Adjust API endpoint
      setWishList(wishList.filter((item) => item._id !== id)); // Update state
      setwidhListToggle(!wishlistToggle)
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <div className={`min-h-screen ${dark ? "bg-[#141414] text-white" : "bg-gray-100 text-black"}  p-6`}>
      <p className="sm:text-[46px] text-[26px] font-extrabold text-center mb-6" style={{ letterSpacing: "9px" }}>My favorite pickings</p>

      {loading ? (
        <p className="text-center ">Loading wishlist...</p>
      ) : wishList.length === 0 ? (
        <p className="text-center">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center place-items-center pb-18">
          {wishList.map((item) => (
            <div key={item._id} className={`w-[250px] relative ${dark ? "bg-black text-white" : "bg-white text-black"} rounded-lg shadow-lg overflow-hidden mt-4 1`}>
              {/* Remove button */}
              <button
                className="absolute top-2 right-2 bg-gray-300 opacity-25 text-black rounded-full p-1 hover:bg-red-600 hover:opacity-100"
                onClick={() => removeFromWishlist(item._id)}
              >
                <X size={18} />
              </button>
              <div className=' h-full flex flex-col' onClick={() => navigate(`/user/viewProduct/${item._id}`)}>

                <img src={item.productimage} alt={item.productname} className="w-full h-40 object-cover" />
                <div className="h-full p-4 text-center flex flex-col gap-1 items-center">
                  <p className='text-xs tracking-widest' style={{ letterSpacing: "7px" }}>{item.productType}</p>
                  <p className="text-lg font-semibold text-[33px]">{item.productname}</p>
                  <div className='bg-black h-[1px] w-[30%]'></div>
                  <p className="text-lg font-semibold text-[13px] italic mt-2">{item.modelnumber}</p>
                  <p className=" text-sm italic" style={{
                    fontSize: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{item.description}</p>
                  <p className="text-green-500 font-bold mt-2">₹{item.price}/-</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
