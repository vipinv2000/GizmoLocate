import React, { useContext } from 'react';
import { Cartcontext } from '../../context/Search&CartContext';
import { Trash2 } from 'lucide-react';
import { Axios } from '../../utils/Axiox';
import toast from 'react-hot-toast';

const ViewCart = () => {
    const { cartedItem, total = 0, refreshContext, setRefreshContext } = useContext(Cartcontext);

    const quantityChange = async (shopId, productId, changeState) => {
        console.log(shopId, productId, changeState);
        try {
            const response = await Axios.get(`/user/countChange/${shopId}/${productId}/${changeState}`);
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data?.message || "Something went wrong!";
                toast.error(errorMessage)
                console.error("Error:", errorMessage);
            } else {
                alert("Network error. Please check your connection.");
                console.error("Network error:", error);
            }
        } finally {
            setRefreshContext(!refreshContext);
        }

    };

    const deletedCartedProduct = async (shopId, productId) => {
        try {
            const resp = await Axios.get(`/user/deleteCart/${shopId}/${productId}`);

        } catch (error) {
            console.log(resp);
            alert("Failed to remove product. Please try again.");
        } finally {
            setRefreshContext(!refreshContext);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

            {cartedItem?.shopProduct?.length > 0 ? (
                cartedItem.shopProduct.map((shop) => (
                    <div key={shop._id} className="mb-6 bg-white p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">{shop.shopId.shopname}</h2>
                        <ul>
                            {shop.products.map((product) => (
                                <li key={product._id} className="flex items-center justify-between p-3 border-b">
                                    <div className="flex items-center gap-4">
                                        <img src={product.productId.productimage} alt={product.productId.productname} className="w-16 h-16 rounded-lg" />
                                        <div className="flex flex-col gap-3">
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

            <div className="flex justify-between items-center bg-gray-100 p-4 mt-4 rounded-lg">
                <h2 className="text-lg font-semibold">Total Amount:</h2>
                <p className="text-xl font-bold">₹{total}</p>
            </div>
        </div>
    );
};

export default ViewCart;
