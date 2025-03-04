import React, { useEffect, useState } from 'react';
import { Axios } from '../../utils/Axiox';

const ListShops = () => {
  const [shopList, setShopList] = useState([]);

  useEffect(() => {
    const fetchAllShops = async () => {
      try {
        const { data } = await Axios.get('/admin/ListShops');
        setShopList(data.shops);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllShops();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Shop List</h1>
      {shopList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopList.map((shop) => (
            <div key={shop._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
              <img src={shop.shopimage} alt={shop.shopname} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-lg font-semibold mt-2">{shop.shopname}</h2>
              <p className="text-gray-600 text-sm mt-1">{shop.description}</p>
              <p className="text-gray-700 mt-1">📍 {shop.locationName}</p>
              <p className="text-gray-700">📞 {shop.phonenumber}</p>
              <a
                href={`mailto:${shop.email}`}
                className="mt-2 text-blue-600 hover:underline"
              >
                {shop.email}
              </a>
              <button
                className={`mt-3 px-4 py-2 text-white rounded-md ${shop.isAccept ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {shop.isAccept ? 'Accepted' : 'Pending'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-gray-700">No Shops Found</h2>
        </div>
      )}
    </div>
  );
};

export default ListShops;
