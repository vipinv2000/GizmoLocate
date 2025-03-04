import React, { useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { useContext } from 'react';
import {
    MapPin,
    Mail,
    Phone,
    Edit,
    ChevronsDown,
} from 'lucide-react';
import { Axios } from '../../utils/Axiox.js';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";


const Profile_page = () => {

    const [recentOrders, setRecentOrders] = useState([])
    const [currentUser, setcurrentUser] = useState();
    const { user } = useContext(AppContext);

    useEffect(() => {
        if (user) {
            setcurrentUser(user);
            fetchRecendOrders()
            console.log('joljfoj', user);
        }
    }, [user]);

    console.log('currentUser', currentUser);
    const fetchRecendOrders = async () => {
        try {
            const { data } = await Axios.get('/user/recentOrder');
            console.log("Resend Orders", data);
            setRecentOrders(data?.order?.shopProduct)

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    }


    return (
        <div className=" w-full p-6">
            {/* Profile Header */}
            <div className="rounded-xl shadow-sm mb-8 bg-white">
                <div className="p-8">
                    <div className="flex items-center space-x-8">
                        <div className="relative">
                            <img
                                src={currentUser?.profilePic || 'Avatar.png'}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {currentUser?.fullName}
                                    </h1>
                                    <p className="text-gray-500">
                                        Member since{' '}
                                        {new Date(currentUser?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900">+91 {currentUser?.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-900">
                                        {currentUser?.locationName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm mt-8  ">
                        <div className=" p-6 border-b border-gray-100 flex justify-between ">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Recent Orders
                            </h2>
                            <motion.div
                                animate={{ y: [0, 5, 0] }} // Moves down and back up
                                transition={{
                                    duration: 1, // Time for one cycle
                                    repeat: Infinity, // Infinite loop
                                    ease: "easeInOut", // Smooth animation
                                }}
                            >
                                <ChevronsDown size={32} className="text-black" />
                            </motion.div>
                        </div>
                        <div className="bg-white divide-y rounded-xl divide-gray-100 h-[280px] overflow-y-scroll hide-scrollbar ">
                            {recentOrders.map(order => (
                                order.products.map(pro => (
                                    <div
                                        key={order.id}
                                        className="p-6 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {pro.productId.productname}
                                            </p>
                                            <p className="text-sm text-gray-500"> {pro.date}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                ₹ {pro.productId.price}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.isDelivered
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {order.isDelivered ? "Delivered" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))


                            ))}
                        </div>
                    </div>

                </div>

                {/* Account Settings */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-5xl font-bold text-gray-900 mb-6">
                            Top shops
                        </p>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                Shop1
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                <div className="flex items-center">shop2</div>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                shop3
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile_page