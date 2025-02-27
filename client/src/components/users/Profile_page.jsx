import React, { useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { useContext } from 'react';
import { MapPin, Mail, Phone, Edit } from 'lucide-react';
const Profile_page = () => {
  const { user } = useContext(AppContext);

  const [currentUser, setcurrentUser] = useState();
  useEffect(() => {
    if (user) {
      setcurrentUser(user);
      console.log('joljfoj', user);
    }
  }, [user]);

  console.log('currentUser', currentUser);

  const recentOrders = [
    {
      id: 1,
      product: 'Designer Watch',
      date: '2024-03-10',
      status: 'Delivered',
      amount: '$299.99',
    },
    {
      id: 2,
      product: 'Leather Bag',
      date: '2024-03-09',
      status: 'In Transit',
      amount: '$199.99',
    },
    {
      id: 3,
      product: 'Sunglasses',
      date: '2024-03-08',
      status: 'Processing',
      amount: '$149.99',
    },
  ];

  return (
    <div className="p-4 w-full">
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
                  <p className="text-gray-900">
                    +91 {currentUser?.phonenumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{currentUser?.locationName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm mt-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.product}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {order.amount}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm mt-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.product}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {order.amount}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Top shops</h2>
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
  );
};

export default Profile_page;
