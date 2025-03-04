import React, { useState, useEffect, useRef } from 'react';
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
  TrendingUp,
  Users,
  Calendar,
  Truck,
  ShoppingBag,
  AlertCircle,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  IndianRupee,
  CheckCircle,
  Clock,
  Hourglass,
  HourglassIcon,
  Boxes,
} from 'lucide-react';
import { Axios } from '../../utils/Axiox';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import OrdersChart from '../Chart';

const ShopHome = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [productimage, setProductImage] = useState('');
  const [formData, setFormData] = useState({
    productname: '',
    category: '',
    productType: '',
    modelnumber: '',
    quantity: '',
    price: '',
    description: '',
    productimage: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [productList, setProductList] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [showfullfilledOrders, setShowFullfilledOrders] = useState(false);
  const [fullfilledOrders, setFullfilledOrders] = useState([]);
  const [fullfilledOrdersCount, setFullfilledOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [showorderStatus, setShowOrderStatus] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [shopUsers, setShopUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const productRef = useRef(null);
  const ordersRef = useRef(null);
  const usersRef = useRef(null);
  const fullfillRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await Axios.get('/shop/showproduct');
        setProductList(data.myShopProduct);
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };

    const fetchPendingOrders = async () => {
      try {
        const { data } = await Axios.get('/shop/pendingOrders');
        setPendingOrders(data.undeliveredOrders || []);
        setPendingOrdersCount(data.totalUndeliveredOrders || 0);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const { data } = await Axios.get('/shop/revenue');
        setTotalRevenue(data.totalRevenue || 0);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    };

    setIsLoaded(true);
    fetchProducts();
    fetchPendingOrders();
    fetchTotalRevenue();
  }, []);

  const fetchShopUsers = async () => {
    try {
      const { data } = await Axios.get('/shop/users');
      setShopUsers(data.users || []);
      setShowUsers(true);
      setShowOrderStatus(false)
      setShowFullfilledOrders(false);
      setShowProducts(false);
      setShowPendingOrders(false);
      setTimeout(() => {
        usersRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    } catch (error) {
      console.error('Error fetching shop users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchFullfilledOrders = async () => {
    try {
      const { data } = await Axios.get('/shop/fullfilledOrders');
      setFullfilledOrders(data.deliveredOrders || []);
      setFullfilledOrdersCount(data.totaldeliveredOrders || 0);
      setShowFullfilledOrders(true);
      setShowOrderStatus(false)
      setShowPendingOrders(false);
      setShowProducts(false);
      setShowUsers(false);
      setTimeout(() => {
        fullfillRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    } catch (error) {
      console.error('Error fetching fullfilled orders:', error);
    }
  };

  const Navigate = useNavigate();

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
      setProductImage(base64Image);
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const finalData = {
      ...formData,
      productimage,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };
    console.log('Final Data Before Submit:', finalData);
    try {
      const { data } = await Axios.post('/shop/add-product', finalData);
      if (data.success) {
        setImagePreview('');
        setProductImage('');
        setFormData({
          productname: '',
          category: '',
          productType: '',
          modelnumber: '',
          quantity: '',
          price: '',
          description: '',
          productimage: null,
        });
        setIsAddingProduct(false);

        // Refresh product list
        const response = await Axios.get('/shop/showproduct');
        setProductList(response.data.myShopProduct);
      }
      Navigate('/shop/home');
      toast.success('Product added successfully');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Product Adding failed!');
    }
  };

  const stats = [
    {
      title: 'Total Products',
      value: productList.length,
      icon:  () => <Boxes size={28} className="text-white" />, 
      trend: 'Click to CheckOut the products..',
      color: 'bg-blue-500',
      onClick: () => {
        setShowProducts(true);
        setShowOrderStatus(false)
        setShowFullfilledOrders(false);
        setShowPendingOrders(false);
        setShowUsers(false);
        setTimeout(() => {
          productRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      },
    },
    {
      title: 'Total Revenue',
      value: `Rs ${totalRevenue}`,
      icon: IndianRupee,
      trend: 'From delivered orders',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: pendingOrdersCount,
      icon: () => <HourglassIcon size={24} className="text-white" />, 
      trend: 'Click to view pending orders',
      color: 'bg-red-500',
      onClick: () => {
        setShowPendingOrders(true);
        setShowOrderStatus(false)
        setShowFullfilledOrders(false);
        setShowProducts(false);
        setShowUsers(false);
        setTimeout(() => {
          ordersRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      },
    },
  ];

  const quickActions = [
    {
      icon: CheckCircle,
      title: 'Completed Orders',
      description: 'Click herer to the completed orders',
      onClick: fetchFullfilledOrders,
    },
    {
      icon: Users,
      title: 'Customer List',
      description: 'View your shop customers',
      onClick: fetchShopUsers,
    },
    {
      icon: TrendingUp,
      title: 'Order Status',
      description: 'Check how far to go...',
      onClick:async()=>{
       try {
        const { data } = await Axios.get('/shop/fullfilledOrders');
        setFullfilledOrdersCount(data.totaldeliveredOrders || 0);
        setShowOrderStatus(true)
        setShowFullfilledOrders(false);
      setShowPendingOrders(false);
      setShowProducts(false);
      setShowUsers(false);
        
       } catch (e) {
        toast.error("Retry")
       }
      }
    },
  ];

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const markAsDelivered = async orderId => {
    if (!orderId) {
      toast.error('Missing orderId ');
      return;
    }

    try {
      const response = await Axios.patch(`/shop/completeOrder/${orderId}`);

      if (response.data) {
        const { data } = await Axios.get('/shop/pendingOrders');
        setPendingOrders(data.undeliveredOrders || []);
        setPendingOrdersCount(data.totalUndeliveredOrders || 0);

        const revenueResponse = await Axios.get('/shop/revenue');
        setTotalRevenue(revenueResponse.data.totalRevenue || 0);

        toast.success('Order marked as delivered successfully');
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error(
        error.response?.data?.message || 'Failed to mark order as delivered'
      );
    }
  };

  return <>
  <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`flex justify-between items-center mb-8 transition-all duration-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your products and monitor sales
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddingProduct(true);
              setShowFullfilledOrders(false);
              setShowProducts(false);
              setShowPendingOrders(false);
              setShowUsers(false);
            }}
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
                onClick={stat.onClick || null}
                className={`bg-white rounded-xl shadow-sm p-6 transform transition-all duration-500 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                } ${stat.onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace(
                        'bg-',
                        'text-'
                      )}`}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{stat.trend}</p>
              </div>
            ))}
          </div>
        )}

        {!isAddingProduct && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={action.onClick || null}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left transform hover:-translate-y-1 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <action.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}

          </div>
        )}

        {isAddingProduct && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Product
              </h2>
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
                    onChange={e =>
                      setFormData({ ...formData, productname: e.target.value })
                    }
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
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Decor">Decor</option>
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
                    onChange={e =>
                      setFormData({ ...formData, productType: e.target.value })
                    }
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
                    onChange={e =>
                      setFormData({ ...formData, modelnumber: e.target.value })
                    }
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
                    onChange={e =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
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
                    onChange={e =>
                      setFormData({ ...formData, price: e.target.value })
                    }
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
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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

        {showProducts && (
          <div
            ref={productRef}
            className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn relative"
          >
            <button
              onClick={() => setShowProducts(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product List
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productList.length > 0 ? (
                productList.map(product => (
                  <div
                    key={product._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={product.productimage}
                      alt={product.productname}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.productname}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.description}
                    </p>
                    <p className="text-md font-bold text-gray-700 mt-2">
                      ${product.price}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3 text-center">
                  No products found
                </p>
              )}
            </div>
            {showProducts && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Back to Top
              </button>
            )}
          </div>
          
        )}

        {showPendingOrders && (
          <div
            ref={ordersRef}
            className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn relative"
          >
            <button
              onClick={() => setShowPendingOrders(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Orders
            </h2>

            {pendingOrders.length > 0 ? (
              <div className="space-y-6">
                {pendingOrders.map(order => (
                  <div
                    key={order.orderId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <ShoppingBag className="h-5 w-5 mr-2 text-purple-500" />
                          Order #{order.orderId.substring(order.orderId)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {order.user.fullName} ({order.user.email})
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Truck className="h-3 w-3 mr-1" />
                            Pending Delivery
                          </span>
                        )}
                      </div>
                    </div>

                    {order.products && order.products.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Products:
                        </h4>
                        <div className="space-y-3">
                          {order.products.map(product => (
                            <div
                              key={product._id}
                              className="flex items-center p-2 bg-gray-50 rounded-md"
                            >
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium">{product.name}</h5>
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>Qty: {product.quantity}</span>
                                  <span>
                                    Rs {product.price * product.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Order Date:{' '}
                            {order.products?.[0]?.date
                              ? formatDate(order.products[0].date)
                              : 'N/A'}
                          </span>
                          <button
                            onClick={() => markAsDelivered(order.orderId)}
                            className="px-4 py-2 rounded-lg text-sm  bg-green-600 text-white hover:bg-green-700"
                          >
                            Mark as Delivered
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                        <p className="text-yellow-700 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          No products found for this order
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No pending orders found</p>
              </div>
            )}

            {showPendingOrders && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Back to Top
              </button>
            )}
          </div>
        )}

        {showfullfilledOrders && (
          <div
            ref={fullfillRef}
            className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn relative"
          >
            <button
              onClick={() => setShowFullfilledOrders(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Completed Orders
            </h2>

            {fullfilledOrders.length > 0 ? (
              <div className="space-y-6">
                {fullfilledOrders.map(order => (
                  <div
                    key={order.orderId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <ShoppingBag className="h-5 w-5 mr-2 text-purple-500" />
                          Order #{order.orderId.substring(order.orderId)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {order.user.fullName} ({order.user.email})
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Delivered
                        </span>
                      </div>
                    </div>

                    {order.products && order.products.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Products:
                        </h4>
                        <div className="space-y-3">
                          {order.products.map(product => (
                            <div
                              key={product._id}
                              className="flex items-center p-2 bg-gray-50 rounded-md"
                            >
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium">{product.name}</h5>
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>Qty: {product.quantity}</span>
                                  <span>
                                    Rs {product.price * product.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Order Date:{' '}
                            {order.products?.[0]?.date
                              ? formatDate(order.products[0].date)
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                        <p className="text-yellow-700 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          No products found for this order
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No completed orders found</p>
              </div>
            )}

            {showfullfilledOrders && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Back to Top
              </button>
            )}
          </div>
        )}

        {showUsers && (
          <div
            ref={usersRef}
            className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn relative"
          >
            <button
              onClick={() => setShowUsers(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shop Customers
            </h2>

            {shopUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopUsers.map(user => (
                  <div
                    key={user._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Customer since {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <p className="text-sm flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </p>
                      )}
                      {user.address && (
                        <p className="text-sm flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {user.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center text-gray-600">
                          <ShoppingCart className="h-4 w-4 mr-1 text-gray-400" />
                          Orders: {user.orderCount || 0}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          ${user.totalSpent || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No customers found</p>
              </div>
            )}

            {showUsers && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Back to Top
              </button>
            )}
          </div>
        )}
           
      </div>
    <div className=" w-2xl ml-[30%] relative">
  {showorderStatus && (
    <div>
       <button
              onClick={() => setShowOrderStatus(false)}
              className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
      
      <OrdersChart 
    pendingOrdersCount={pendingOrdersCount} 
    completedOrdersCount={fullfilledOrdersCount} 
  /></div>
  )}
</div>
    </div>

  </>
};

export default ShopHome;
