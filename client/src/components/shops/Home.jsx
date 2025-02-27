import React, { useState, useEffect } from 'react';
import {
  Plus,
  Package,
  Store,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  Hash,
  Box,
  Type,
  ImagesIcon,
  LayoutDashboard,
  TrendingUp,
  Users
} from 'lucide-react';

const ShopHome = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    productname: '',
    category: '',
    productType: '',
    modelnumber: '',
    quantity: 0,
    price: 0,
    description: '',
    productimage: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, productimage: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      console.log('Product data:', formDataToSend);
      
      setIsAddingProduct(false);
      setFormData({
        productname: '',
        category: '',
        productType: '',
        modelnumber: '',
        quantity: 0,
        price: 0,
        description: '',
        productimage: null
      });
      setImagePreview('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const stats = [
    {
      title: "Total Products",
      value: "0",
      icon: Package,
      trend: "+0% from last month",
      color: "bg-blue-500"
    },
    {
      title: "Total Revenue",
      value: "$0",
      icon: DollarSign,
      trend: "+0% from last month",
      color: "bg-green-500"
    },
    {
      title: "Pending Orders",
      value: "0",
      icon: Package,
      trend: "No change from last month",
      color: "bg-purple-500"
    }
  ];

  const quickActions = [
    { icon: LayoutDashboard, title: "View Analytics", description: "Check your shop's performance" },
    { icon: TrendingUp, title: "Sales Report", description: "Download monthly reports" },
    { icon: Users, title: "Customer List", description: "Manage your customers" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your products and monitor sales</p>
          </div>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transform transition-transform duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        {!isAddingProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`bg-white rounded-xl shadow-sm p-6 transform transition-all duration-500 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700">{stat.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{stat.trend}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {!isAddingProduct && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left transform hover:-translate-y-1 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <action.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Add Product Form */}
        {isAddingProduct && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  setImagePreview('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4 mr-2" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productname"
                    value={formData.productname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Store className="h-4 w-4 mr-2" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Type className="h-4 w-4 mr-2" />
                    Product Type
                  </label>
                  <input
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Hash className="h-4 w-4 mr-2" />
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="modelnumber"
                    value={formData.modelnumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Box className="h-4 w-4 mr-2" />
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ImagesIcon className="h-4 w-4 mr-2" />
                    Product Image
                  </label>
                  <div className="flex flex-col items-center space-y-2">
                    <input
                      type="file"
                      name="productimage"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setImagePreview('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-transform duration-200 hover:scale-105"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHome;