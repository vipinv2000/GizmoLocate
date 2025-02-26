import React, { useEffect, useState, useContext } from 'react';
import { Axios } from '../../utils/Axiox';
import { AppContext } from '../../context/AppContext';
import { ProductContext } from '../../context/ProductContext';
import toast from 'react-hot-toast';
import { FiMapPin } from 'react-icons/fi'; // Location icon
import { MdLocationOn } from 'react-icons/md'; // Filled location icon

const SettingsPage = () => {
  const [locationtext, setLocationtext] = useState('');
  const [locationArray, setLocationArray] = useState([]);
  const { isAuth, user, refresh, setRefresh } = useContext(AppContext);
  const { wishlistToggle, setwidhListToggle } = useContext(ProductContext);

  const fetchShopLocations = async () => {
    try {
      if (locationtext.trim() === "") {
        setLocationArray([]);
      } else {
        const { data } = await Axios(`/user/fetchAllLocation?location=${locationtext}`);
        console.log("Locations:", data);
        setLocationArray(data.locations || []);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const updateUserLocation = async (location) => {
    try {
      const { data } = await Axios.get(`/user/UpdateChooseLocation/${location}`);
      setRefresh(!refresh);
      setwidhListToggle(!wishlistToggle);
      setLocationtext('');
      toast.success(data.message);
      return data;
    } catch (error) {
      console.error("Error updating location:", error.response?.data || error.message);
      toast.error("Failed to update location");
    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      fetchShopLocations();
    }, 300);
    return () => clearTimeout(time);
  }, [locationtext]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[420px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <MdLocationOn className="text-blue-600 text-2xl" />
          Select Your Location
        </h2>

        <div className="relative w-full">
          <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
            <FiMapPin className="text-gray-600 text-xl mr-2" />
            <input
              id="location-search"
              className="w-full bg-transparent outline-none text-gray-700"
              placeholder="Search location..."
              type="text"
              value={locationtext}
              onChange={(e) => setLocationtext(e.target.value)}
            />
          </div>
        </div>

        {isAuth && user?.locationName && (
          <p className="mt-3 text-sm text-gray-700">
            <MdLocationOn className="inline-block text-blue-500 text-lg mr-1" />
            Your current location: <strong>{user.locationName}</strong>
          </p>
        )}

        <div className="mt-3">
          {locationArray.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-2">No locations found</p>
          ) : (
            <ul className="bg-white border border-gray-300 rounded-lg mt-3 shadow-md overflow-hidden">
              {locationArray.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-3 hover:bg-blue-100 cursor-pointer transition-all duration-200"
                  onClick={() => updateUserLocation(item)}
                >
                  <MdLocationOn className="text-blue-500 text-lg mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
