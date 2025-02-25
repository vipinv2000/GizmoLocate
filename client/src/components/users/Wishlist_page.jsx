import React, { useContext, useEffect, useState } from 'react';
import { Axios } from '../../utils/Axiox';
import { X } from 'lucide-react'; // Importing cross icon
import { ProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setwidhListToggle, wishlistToggle } = useContext(ProductContext);
  const navigate = useNavigate()

  const fetchWishList = async () => {
    try {
      const { data } = await Axios.get('/user/mywishlist');
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">My Wishlist</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading wishlist...</p>
      ) : wishList.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishList.map((item) => (
            <div key={item._id} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Remove button */}
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => removeFromWishlist(item._id)}
              >
                <X size={18} />
              </button>
              <div onClick={() => navigate(`/user/viewProduct/${item._id}`)}>

                <img src={item.productimage} alt={item.productname} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.productname}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-blue-500 font-bold mt-2">₹{item.price}</p>
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
