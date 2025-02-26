import React, { useContext, useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Camera, MapPin, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Axios } from '../../utils/Axiox';

const UserSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchLocation, setSearchLocation] = useState('')
  const [searchLocationArray, setSearchLocationArray] = useState([])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    locationName: '',
    phoneNumber: '',
    profilePic: null,
  });

  const [profilePic, setProfilePic] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const { setUser, setIsAuth } = useContext(AppContext);
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setProfilePic(base64Image);
    };
  };


  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.locationName.trim()) return toast.error("location is required");
    if (!formData.phoneNumber.trim()) return toast.error("Phonenumber is required");

    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");


    const finalData = { ...formData, profilePic };
    console.log('Final Data Before Submit:', finalData);
    setLoading(true);

    try {

      const { data } = await Axios.post('/user/signUp', finalData);
      if (data.success) {
        setIsAuth(true)
        setUser(data.user)
      }

      navigate('/user/home')
      toast.success('Account created successfully!');
      console.log('User Data:', data);
      console.log('User ffData:', formData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  const FetchAll_location = async () => {
    try {
      if (searchLocation.trim() === "") {

      } else {
        console.log(searchLocation);
        
        const { data } = await Axios(`/user/fetchAllLocationforRegister?location=${searchLocation}`);
        console.log("Locations:", data);
        setSearchLocationArray(data.locations)
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {

    const time = setTimeout(() => {
      FetchAll_location()
    }, 200);

    return () => {
      clearTimeout(time)
    }
  }, [searchLocation])



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Create an Account
        </h2>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || '/Avatar.png'}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer hover:scale-105 transition"
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Click the camera icon to upload
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type="text"
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-3 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={e =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type="text"
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                placeholder="Search for your location..."
                value={searchLocation}
                onChange={(e) => {
                  
                  setSearchLocation(e.target.value)
                }}
              />

              {/* Suggestions Box */}
              {searchLocation.trim() && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto">
                  {searchLocationArray.length > 0 ? (
                    searchLocationArray.map((loc, index) => (
                      <div
                        key={index}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                          setFormData({ ...formData, locationName: loc });
                          setSearchLocation(loc);
                        }}
                      >
                        <MapPin className="text-blue-500 size-4 mr-2" />
                        <span className="text-gray-800">{loc}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 text-sm">No locations found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phonenumber</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type="text"
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-3 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="+9999999999"
                value={formData.phoneNumber}
                onChange={e =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type="email"
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-3 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-10 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <Link
              to="/user/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
