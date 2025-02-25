import React, { useContext, useState } from "react";
import { Cartcontext } from "../../context/Search&CartContext";
import { Trash2 } from "lucide-react";
import { Axios } from "../../utils/Axiox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ViewCart = () => {
    const { cartedItem, total = 0, refreshContext, setRefreshContext } = useContext(Cartcontext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const quantityChange = async (shopId, productId, changeState) => {
        try {
            await Axios.get(`/user/countChange/${shopId}/${productId}/${changeState}`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        } finally {
            setRefreshContext(!refreshContext);
        }
    };

    const deletedCartedProduct = async (shopId, productId) => {
        try {
            await Axios.get(`/user/deleteCart/${shopId}/${productId}`);
        } catch (error) {
            toast.error("Failed to remove product. Please try again.");
        } finally {
            setRefreshContext(!refreshContext);
        }
    };

    const proceedToPayment = async () => {
        try {
            const order = await Axios.get(`/user/placeOrder/${paymentMethod}`)
            toast.success(order.data.message);
            navigate("/user/orders");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    const totalItems = cartedItem?.shopProduct?.reduce((acc, shop) => acc + shop.products.length, 0) || 0;

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Shopping Cart</h1>
                    <p className="text-lg font-medium bg-gray-200 px-3 py-1 rounded-md">
                        Items in Cart: {totalItems}
                    </p>
                </div>

                {cartedItem?.shopProduct?.length > 0 ? (
                    cartedItem.shopProduct.map((shop) => (
                        <div key={shop._id} className="mb-6 bg-white p-4 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">{shop.shopId.shopname}</h2>
                            <ul>
                                {shop.products.map((product) => (
                                    <li key={product._id} className="flex items-center justify-between p-3 border-b">
                                        <div className="flex items-center gap-4">
                                            <img src={product.productId.productimage} alt={product.productId.productname} className="w-16 h-16 rounded-lg" />
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-medium">{product.productId.productname}</h3>
                                                <p className="text-sm text-gray-500">Category: {product.productId.category}</p>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => quantityChange(shop.shopId._id, product.productId._id, false)} className="px-2 py-1 bg-red-200 rounded">-</button>
                                                    <p className="text-sm">{product.quantity}</p>
                                                    <button onClick={() => quantityChange(shop.shopId._id, product.productId._id, true)} className="px-2 py-1 bg-green-200 rounded">+</button>
                                                </div>
                                                <p className="font-semibold">₹ {product.productId.price}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deletedCartedProduct(shop.shopId._id, product.productId._id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">Your cart is empty</p>
                )}
            </div>

            {/* Right Side - Checkout Form */}
            {cartedItem?.shopProduct?.length > 0 && (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-700">Total Items:</p>
                        <p className="font-semibold">{totalItems}</p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p className="text-gray-700">Total Amount:</p>
                        <p className="font-bold text-lg">₹{total}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Payment Method:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="cod" >Pay upon delivery.</option>
                            <option value="online" disabled>Online Payment</option>
                        </select>
                    </div>

                    <button
                        onClick={proceedToPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Proceed to Payment
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewCart;
