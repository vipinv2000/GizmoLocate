import React, { useEffect, useState } from "react";
import { Axios } from "../../utils/Axiox";
import toast from "react-hot-toast";
import { ToastContainer, toast as toastify } from 'react-toastify';

const AcceptShops = () => {
  const [activateShop, setActivateShop] = useState([]);

  const listshop = async () => {
    try {
      const { data } = await Axios.get("/admin/listRequestedShop");
      const { success, listshop, message } = data;
      if (success) {
        toast.success("Fetched");
        setActivateShop(listshop);
        console.log(listshop);
      } else {
        toast.error(message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
const AcceptShops=async (id)=>{
    try {
        const {data}= await Axios.get(`/admin/acceptReq/${id}`)
        toastify.success(data.message)
        listshop()
    } catch (e) {
        toastify.error(e.message)
    }
}
  useEffect(() => {
    listshop();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
        <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Requested Shops
      </h1>
      
      {activateShop.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activateShop.map((shop) => (
            <div
              key={shop._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="data:image/jpeg;base64,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"
                alt={shop.shopname}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {shop.shopname}
                </h2>
                <p className="text-gray-600 text-sm">{shop.description}</p>
                
                <div className="mt-4">
                  <p className="text-gray-700">
                    📧 <strong>Email:</strong> {shop.email}
                  </p>
                  <p className="text-gray-700">
                    📞 <strong>Phone:</strong> {shop.phonenumber}
                  </p>
                  <p className="text-gray-700">
                    📍 <strong>Location:</strong> {shop.locationName}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      shop.isAccept ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {shop.isAccept ? "✅ Accepted" : "❌ Pending Approval"}
                  </p>
                </div>
                
                <button onClick={()=>AcceptShops(shop._id)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300">
                  Approve Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">No shops found.</p>
      )}
    </div>
  );
};

export default AcceptShops;
