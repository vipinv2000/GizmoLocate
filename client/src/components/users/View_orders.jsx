import React, { useContext, useEffect, useState } from "react";
import { Axios } from "../../utils/Axiox";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "./Button";

const ViewOrders = () => {
    const [listOrders, setListOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { setActiveTab, dark } = useContext(AppContext)

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

    const handleNavigate = (userLat, userLng) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = `${position.coords.latitude},${position.coords.longitude}`;
                    const destination = `${userLat},${userLng}`;
                    const mapUrl = `https://www.google.com/maps/dir/${userLocation}/${destination}`;
                    window.open(mapUrl, "_blank");
                },
                (error) => {
                    alert("Unable to retrieve your location. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className={`w-full h-screen overflow-y-scroll hide-scrollbar mx-auto px-22 pb-24 ${dark ? "bg-[#141414] text-white" : "text-black bg-gray-100"} `}>
            <p className="text-center mb-4 text-[40px] mt-4  font-extrabold" style={{ wordSpacing: "17px", letterSpacing: "15px" }}>Orders and Purchases</p>

            {loading && <p className="text-center text-blue-500">Loading orders...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && listOrders.length === 0 && (
                <p className="text-center text-gray-600">No orders found.</p>
            )}

            {!loading &&
                !error &&
                listOrders.slice().reverse().map((order) => (
                    <div key={order._id} className={`${dark ? "bg-[#0F0F0F]" : "bg-white shadow-lg"} p-4 rounded-lg mb-4`}>
                        {/* Order Date & Payment */}
                        <div className="flex justify-between items-center  pb-3">
                            <span className=" text-sm">Order Date: {order.Datetime}</span>
                            <span className=" font-medium">
                                Payment: {order.PaymentMethod.toUpperCase()}
                            </span>
                        </div>

                        {/* Shop and Product Details */}
                        {order.shopProduct.length > 0 ? (
                            order.shopProduct.map((shopItem) => (
                                <div key={shopItem._id} className="mt-4  p-3 rounded-lg">
                                    {/* Shop Details */}
                                    <div className="flex items-center justify-between gap-4    ">
                                        <div className=" flex gap-5 h-full items-center pl-3">
                                            {shopItem.shopId?.shopimage && (
                                                <img
                                                    src={shopItem.shopId.shopimage}
                                                    alt={shopItem.shopId.shopname}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold">{shopItem.shopId?.shopname || "Unknown Shop"}</h3>
                                                <p className="">{shopItem.shopId?.locationName || "Unknown Location"}</p>
                                            </div>
                                        </div>
                                        <div className="flex h-full items-center gap-12">
                                            <a href={`mailto:${shopItem.shopId?.email}`}>
                                                <Mail className="hover:scale-125" />
                                            </a>
                                            <a href={`tel:${shopItem.shopId?.phonenumber}`}>
                                                <Phone className="hover:scale-125" />
                                            </a>
                                            <button
                                                onClick={() => handleNavigate(shopItem.shopId?.lat, shopItem.shopId?.lng)}
                                            >
                                                <MapPin className="hover:scale-125" />
                                            </button>

                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="mt-3">
                                        {shopItem.products && shopItem.products.length > 0 ? (
                                            shopItem.products.map((product) => (
                                                <div key={product._id} className="flex items-center gap-4 p-3 ">
                                                    {product.productId?.productimage && (
                                                        <img
                                                            src={product.productId.productimage}
                                                            alt={product.productId.productname}
                                                            className="w-14 h-14 object-cover rounded-md"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="text-md font-semibold">{product.productId?.productname || "Unknown Product"}</h4>
                                                        <p className="">₹{product.productId?.price || 0} x {product.quantity}</p>
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
