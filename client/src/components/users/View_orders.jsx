import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../utils/Axiox";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const ViewOrders = () => {
    const [listOrders, setListOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {setActiveTab } = useContext(AppContext)

    const getOrderedItems = async () => {
        try {
            const { data } = await Axios.get("/user/viewOrder");
            if (data.success && Array.isArray(data.isOrdered)) {
                setListOrders(data.isOrdered.filter(order => order.shopProduct && order.shopProduct.length > 0)); // Exclude empty orders
            } else {
                toast.error("Failed to fetch orders.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setActiveTab('orders')
        getOrderedItems();
    }, []);

    return (
        <div className="container mx-auto p-4 mb-24">
            <h2 className="text-2xl font-bold text-center mb-4">My Orders</h2>

            {loading && <p className="text-center text-blue-500">Loading orders...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && listOrders.length === 0 && (
                <p className="text-center text-gray-600">No orders found.</p>
            )}

            {!loading &&
                !error &&
                listOrders.map((order) => (
                    <div key={order._id} className="bg-white shadow-lg p-4 rounded-lg mb-4">
                        {/* Order Date & Payment */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <span className="text-gray-600 text-sm">Order Date: {order.Datetime}</span>
                            <span className="text-gray-700 font-medium">
                                Payment: {order.PaymentMethod.toUpperCase()}
                            </span>
                        </div>

                        {/* Shop and Product Details */}
                        {order.shopProduct.length > 0 ? (
                            order.shopProduct.map((shopItem) => (
                                <div key={shopItem._id} className="mt-4 border p-3 rounded-lg">
                                    {/* Shop Details */}
                                    <div className="flex items-center gap-4 border-b pb-3">
                                        {shopItem.shopId?.shopimage && (
                                            <img
                                                src={shopItem.shopId.shopimage}
                                                alt={shopItem.shopId.shopname}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold">{shopItem.shopId?.shopname || "Unknown Shop"}</h3>
                                            <p className="text-gray-500">{shopItem.shopId?.location || "Unknown Location"}</p>
                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="mt-3">
                                        {shopItem.products && shopItem.products.length > 0 ? (
                                            shopItem.products.map((product) => (
                                                <div key={product._id} className="flex items-center gap-4 p-3 border-b">
                                                    {product.productId?.productimage && (
                                                        <img
                                                            src={product.productId.productimage}
                                                            alt={product.productId.productname}
                                                            className="w-14 h-14 object-cover rounded-md"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="text-md font-semibold">{product.productId?.productname || "Unknown Product"}</h4>
                                                        <p className="text-gray-500">₹{product.productId?.price || 0} x {product.quantity}</p>
                                                        <p className="text-gray-500 text-sm">Ordered on: {product.date ? new Date(product.date).toLocaleDateString() : "N/A"}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500">No products in this order.</p>
                                        )}
                                    </div>

                                    {/* Order Status */}
                                    <div className="mt-3 text-right">
                                        {shopItem.isDelivered ? (
                                            <span className="text-green-600 font-medium">Delivered</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Not Delivered</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No items in this order.</p>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default ViewOrders;
