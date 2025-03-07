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
  const [trysearch, setTrySearch] = useState(false)
  const { isAuth, user, refresh, setRefresh,dark } = useContext(AppContext);
  const { wishlistToggle, setwidhListToggle } = useContext(ProductContext);

  const fetchShopLocations = async () => {
    try {
      if (locationtext.trim() === "") {
        setLocationArray([]);
      } else {
        const { data } = await Axios(`/user/fetchAllLocation?location=${locationtext}`);
        console.log("Locations:", data);
        setLocationArray(data.locations || []);
        if (data.locations.length === 0) {
          setTrySearch(true)
        }
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
    <div className={`w-full h-screen flex justify-center items-center ${dark ? "bg-[#141414] text-white" : "bg-gray-100 text-black"} `}>
      <div className={`w-full   max-w-4xl p-6 rounded-lg mt-7 flex flex-col ${dark ? "bg-[#0F0F0F]" : "bg-white"}  `}>
        <div className='flex justify-between  items-center mb-5'>
          <p className="text-xl font-semibold   flex items-center gap-2">
            
            Select Your Location
          </p>
          {isAuth && user?.locationName && (
            <p className=" text-xl ">
              <MdLocationOn className="inline-block  text-lg mr-1" />
              <strong>{user.locationName}</strong>
            </p>
          )}
        </div>

        <div className="relative w-full ">
          <div className="flex items-center border border-gray-300 rounded-lg p-2 ">
            <FiMapPin className=" text-xl mr-2" />
            <input
              id="location-search"
              className={`w-full bg-transparent outline-none text-gray-700 ${dark ? "placeholder-white text-white" : "placeholder-black text-black"}`}
              placeholder="Search location..."
              type="text"
              value={locationtext}
              onChange={(e) => setLocationtext(e.target.value)}
            />
          </div>
        </div>



        <div className="mt-3">
          {locationArray.length === 0 ? (
            trysearch &&
            <div></div>
          ) : (
            <ul className=" h-max-[200px] border border-gray-300 rounded-lg mt-3 shadow-md overflow-y-scroll hide-scrollbar">
              {locationArray.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center p-3 ${dark ? "hover:bg-gray-900 " : "hover:bg-blue-100 "} cursor-pointer transition-all duration-200`}
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
