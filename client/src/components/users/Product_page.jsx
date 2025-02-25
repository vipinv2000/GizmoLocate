import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Axios } from '../../utils/Axiox';
import toast from 'react-hot-toast';

const Product_page = () => {
    const { proId } = useParams();
    const [singleProduct, setSingleProduct] = useState(null);

    const fetchSingleProduct = async () => {
        try {
            const { data } = await Axios.get(`/user/getSingleproduct/${proId}`);
            setSingleProduct(data.product);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    useEffect(() => {
        fetchSingleProduct();
    }, [proId]);

    const handleAddToCart = async (productId, shopId, pName) => {
        try {
            const { data } = await Axios.get(`/user/addCart/${productId}/${shopId}/${pName}`);
            toast.success(data.message);

            // Update the product quantity in state (for re-render)
            setSingleProduct((prev) => ({
                ...prev,
                quantity: prev.quantity - 1, // Decrease quantity
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    if (!singleProduct) {
        return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="w-full h-screen flex flex-col gap-5 items-center justify-start pt-20 p-4 overflow-y-scroll hide-scrollbar">
            <p className="text-lg font-semibold">Product Details</p>

            {/* Product Card */}
            <div className="w-full sm:w-[90%] max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row">
                {/* Product Image */}
                <div className="w-full sm:w-1/3 bg-gray-100 flex items-center justify-center p-4">
                    <img src={singleProduct.productimage} alt={singleProduct.productname} className="w-full h-auto rounded-lg object-cover" />
                </div>

                {/* Product Info */}
                <div className="w-full sm:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">{singleProduct.productname}</h2>
                        <p className="text-gray-600">{singleProduct.category} - {singleProduct.productType}</p>
                        <p className="text-gray-500 text-sm">Model: {singleProduct.modelnumber}</p>
                        <p className="text-xl font-bold text-green-600 mt-2">₹{singleProduct.price}</p>
                        <p className="text-gray-700 mt-2">{singleProduct.description}</p>

                        {/* Shop Details */}
                        <div className="mt-4 p-3 bg-gray-100 rounded-md">
                            <h3 className="text-lg font-semibold">Sold by: {singleProduct.shop.shopname}</h3>
                            <p className="text-gray-600 text-sm">{singleProduct.shop.location}</p>
                        </div>

                        {/* Stock Status */}
                        <p className={`mt-3 font-semibold ${singleProduct.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                            {singleProduct.quantity > 0 ? `In Stock: ${singleProduct.quantity}` : "Sold Out"}
                        </p>
                    </div>

                    {/* Show "Add to Cart" if in stock, else show "Sold Out" */}
                    {singleProduct.quantity > 0 ? (
                        <button
                            onClick={() => handleAddToCart(singleProduct._id, singleProduct.shop._id, singleProduct.productname)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg text-center">
                            Sold Out
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product_page;
