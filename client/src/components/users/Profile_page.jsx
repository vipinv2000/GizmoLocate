import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { MapPin, Mail, Phone, Edit, ChevronsDown } from 'lucide-react';
import { Axios } from '../../utils/Axiox.js';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const Profile_page = () => {
    const [recentOrders, setRecentOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const { user, dark } = useContext(AppContext);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            fetchRecentOrders();
        }
    }, [user]);

    const fetchRecentOrders = async () => {
        try {
            const { data } = await Axios.get('/user/recentOrder');
            setRecentOrders(data?.order?.shopProduct || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className={`w-full h-screen p-6 ${dark ? " bg-[#0F0F0F]" : "bg-white"}`}>
            <div
                className={`rounded-xl  mb-8 p-8 ${dark
                    ? "shadow-[9px_4px_16px_rgba(155,155,155,0.2)] text-white "
                    : "shadow-lg text-black border border-gray-100"
                    }`}
            >

                <div className="flex items-center space-x-8">
                    <img
                        src={currentUser?.profilePic || 'Avatar.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{currentUser?.fullName}</h1>
                        <p >Member since {new Date(currentUser?.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button className={`px-4 py-2 ${dark ? "bg-white  text-black hover:bg-gray-300" : "bg-gray-800 hover:bg-gray-700 text-white"}  rounded-lg  flex items-center`}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-2">
                    <div className={`rounded-xl  p-6 ${dark
                        ? "shadow-[0px_4px_6px_rgba(155,155,155,0.2)] text-white"
                        : "shadow-lg text-black border border-gray-100"
                        }`}>
                        <h2 className="text-lg font-semibold  mb-6">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5  mr-3" />
                                <div>
                                    <p className="text-sm ">Email</p>
                                    <p >{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-5 w-5  mr-3" />
                                <div>
                                    <p className="text-sm ">Phone</p>
                                    <p >+91 {currentUser?.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-3" />
                                <div>
                                    <p className="text-sm ">Address</p>
                                    <p className="">{currentUser?.locationName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl  mt-8 ${dark
                        ? "shadow-[0px_4px_6px_rgba(155,155,155,0.2)] text-white"
                        : "shadow-lg text-black border border-gray-100"
                        }`}>
                        <div className={`p-6 border-b ${dark ? "border-[#131313]" : "border-gray-100 "} flex justify-between `}>
                            <h2 className="text-lg font-semibold ">Recent Orders</h2>
                            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}>
                                <ChevronsDown size={32} className=""/>
                            </motion.div>
                        </div>
                        <div className={`divide-y rounded-xl ${dark ? "divide-[#131313]" : "divide-gray-200"} h-[280px] overflow-y-scroll hide-scrollbar`}>
                            {recentOrders.map(order => (
                                order.products.map(pro => (
                                    <div key={pro.productId._id} className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium ">{pro.productId.productname}</p>
                                            <p className="text-sm text-gray-500">{pro.date}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm font-medium ">₹ {pro.productId.price}</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.isDelivered ? "Delivered" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className={`rounded-xl p-6
                        ${dark
                            ? "shadow-[0px_4px_6px_rgba(155,155,155,0.2)] text-white"
                            : "shadow-lg text-black border border-gray-100"
                        }`}>
                        <h2 className="text-5xl font-bold  mb-6">Top Shops</h2>
                        <div className="space-y-4">
                            <button className={`w-full p-4 rounded-lg border border-gray-200 ${dark ? "hover:bg-[#171717]" : "hover:bg-gray-50"} `}>Shop1</button>
                            <button className={`w-full p-4 rounded-lg border border-gray-200 ${dark ? "hover:bg-[#171717]" : "hover:bg-gray-50"} `}>Shop2</button>
                            <button className={`w-full p-4 rounded-lg border border-gray-200 ${dark ? "hover:bg-[#171717]" : "hover:bg-gray-50"} `}>Shop3</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile_page;