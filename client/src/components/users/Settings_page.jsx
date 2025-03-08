import React, { useEffect, useState, useContext, useRef } from "react";
import { Axios } from "../../utils/Axiox";
import { AppContext } from "../../context/AppContext";
import { ProductContext } from "../../context/ProductContext";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { Edit, FolderPen, Lock, Mail, MailIcon, Phone, PhoneCall, X } from "lucide-react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { MdVerified } from "react-icons/md";

const SettingsPage = () => {
  const [locationtext, setLocationtext] = useState("");
  const [locationArray, setLocationArray] = useState([]);
  const [trysearch, setTrySearch] = useState(false);
  const { isAuth, user, refresh, setRefresh, dark, setUser } = useContext(AppContext);
  const { wishlistToggle, setwidhListToggle } = useContext(ProductContext);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyed, setVerifyed] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    password: '',
  });

  const debounceRef = useRef(null);

  // Optimized location search with debouncing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (locationtext.trim() === "") {
        setLocationArray([]);
        return;
      }

      try {
        const { data } = await Axios(`/user/fetchAllLocation?location=${locationtext}`);
        setLocationArray(data.locations || []);
        setTrySearch(data.locations.length === 0);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }, 500); // Delay API call by 500ms
  }, [locationtext]);

  const updateUserLocation = async (location) => {
    try {
      const { data } = await Axios.get(`/user/UpdateChooseLocation/${location}`);
      setRefresh(!refresh);
      setwidhListToggle(!wishlistToggle);
      setLocationtext("");
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating location:", error.response?.data || error.message);
      toast.error("Failed to update location");
    }
  };

  const handleProfileUpdate = async () => {
    // Example function for handling profile updates
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const { data } = await Axios.post("/user/verfyUpdateProfile", { email, password });
      console.log("Verify Responceeeee", data);
      setVerifyed(true)
      setEditPopupOpen(false); // Close popup
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Sever Error');
    }
  };

  const handilUpdateProfile = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 5) return toast.error('Password must be at least 5 characters');

    try {
      const { data } = await Axios.post('/user/UpdateProfile', formData);

      setUser(data.user)
      setRefresh(!refresh)
      setVerifyed(false)
      toast.success(data.message)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Sever Error');
    }
    finally {
      setEditPopupOpen(false);
    }
  }

  return (
    <div className={`w-full h-screen flex justify-center items-center ${dark ? "bg-[#141414] text-white" : "bg-gray-100 text-black"}`}>
      <div className={`w-full max-w-4xl py-6 px-8 rounded-lg mt-7 flex flex-col ${dark ? "bg-[#0F0F0F]" : "bg-white"}`}>
        {/* Profile Section */}
        <div className="flex items-center space-x-8">
          <div className=" relative">
            <img src={user?.profilePic || "Avatar.png"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-[2px] border-white" />
            <MdVerified size={"25"} className="text-blue-600 absolute bottom-0 right-1 " />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.fullName}</h1>
          </div>
          <button
            onClick={() => setEditPopupOpen(true)}
            className={`px-4 py-2 ${dark ? "bg-white text-black hover:bg-gray-300" : "bg-gray-800 hover:bg-gray-700 text-white"} rounded-lg flex items-center`}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </button>
        </div>
        {
          verifyed && (
            <form onSubmit={handilUpdateProfile}>
              <div className="mt-5 flex w-full justify-between items-center gap-4 relative">
                <div className=" w-[50%]">
                  <div className="flex gap-5">
                    <div className={`mb-4 flex items-center gap-3 w-full ${dark ? "bg-[#333A5C]" : "placeholder-black  bg-gray-100"} px-4 py-2.5 rounded-full `}>
                      <FolderPen />
                      <input className='bg-transparent outline-none '
                        onChange={e =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        value={formData.fullName} type="text" placeholder='Name' required />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className={`mb-4 flex items-center gap-3 w-full ${dark ? "bg-[#333A5C]" : "placeholder-black  bg-gray-100"} px-4 py-2.5 rounded-full `}>
                      <PhoneCall />
                      <input className='bg-transparent outline-none '
                        onChange={e =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        value={formData.phoneNumber} type="text" placeholder='Phone Number' required />
                    </div>
                  </div>
                </div>
                <div className=" w-[50%]">
                  <div className="flex gap-5">
                    <div className={`mb-4 flex items-center gap-3 w-full ${dark ? "bg-[#333A5C]" : " placeholder-black bg-gray-100"} px-4 py-2.5 rounded-full `}>
                      <MailIcon />
                      <input className='bg-transparent outline-none '
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        value={formData.email} type="text" placeholder='Email id' required />

                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className={`mb-4 flex items-center gap-3 w-full ${dark ? "bg-[#333A5C]" : "placeholder-black  bg-gray-100"} px-4 py-2.5 rounded-full `}>
                      <Lock />
                      <input className='bg-transparent outline-none '
                        onChange={e =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        type="password" placeholder='Password' required />
                    </div>
                  </div>
                </div>
                <div className=" h-[80px]   flex flex-col justify-end items-center">
                  <button
                    className="absolute top-0 right-0 bg-gray-300 opacity-25 text-black rounded-full p-1 hover:bg-red-600 hover:opacity-100"
                    onClick={() => {
                      setVerifyed(false)
                    }}
                  >
                    <X size={18} />
                  </button>
                  <div className={`  ${dark ? "bg-[#333A5C] hover:bg-[#444c74] " : " text-black bg-gray-100 hover:bg-gray-200"}  px-4 py-2 rounded-lg`}>
                    <button>Subbmit</button>
                  </div>
                </div>

              </div>
            </form>
          )
        }



        {/* Edit Profile Popup */}
        <Popup className="bg-red-900" open={editPopupOpen} onClose={() => setEditPopupOpen(false)} modal nested>
          <div className={`p-5 ${dark ? "bg-black text-white" : "bg-white text-black"} rounded-lg shadow-lg  max-w-full mx-auto`}>
            <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
            <div className="flex gap-3">

              <input
                type="email"
                className="w-full p-2 mb-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full p-2 mb-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setEditPopupOpen(false)} className={`px-4 py-2 ${dark ? "bg-gray-100  hover:bg-gray-200 text-black" : "bg-gray-300  hover:bg-gray-400 text-black"}  rounded-lg `}>
                Cancel
              </button>
              <button onClick={handleProfileUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Subbmit
              </button>
            </div>
          </div>
        </Popup>

        {/* Location Selection */}
        <div className="flex justify-between items-center mb-5 mt-5">
          <p className="text-xl font-semibold flex items-center gap-2">Select Location to Find Products</p>
          {isAuth && user?.locationName && (
            <p className="text-xl">
              <MdLocationOn className="inline-block text-lg mr-1" />
              <strong>{user.locationName}</strong>
            </p>
          )}
        </div>

        {/* Search Box */}
        <div className="relative w-full">
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <FiMapPin className="text-xl mr-2" />
            <input
              id="location-search"
              className={`w-full bg-transparent outline-none text-gray-700 ${dark ? "placeholder-white text-white" : "placeholder-black  bg-gray-100text-black"}`}
              placeholder="Search location..."
              type="text"
              value={locationtext}
              onChange={(e) => setLocationtext(e.target.value)}
            />
          </div>

          {/* Search Results */}
          <div className={`  ${dark ? "bg-[#0F0F0F]" : "bg-white"} p-3`}>
            {locationArray.length === 0 && trysearch ? (
              <p className="text-gray-500 text-sm">No locations found. Try a different search.</p>
            ) : (
              <ul className="max-h-[200px]  rounded-lg  shadow-md overflow-y-scroll hide-scrollbar">
                {locationArray.map((item, index) => (
                  <li key={index} className={`flex items-center p-3 ${dark ? "hover:bg-gray-900" : "hover:bg-blue-100"} cursor-pointer transition-all duration-200`} onClick={() => updateUserLocation(item)}>
                    <MdLocationOn className="text-blue-500 text-lg mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
