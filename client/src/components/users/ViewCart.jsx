import React, { useContext, useState } from "react";
import { Cartcontext } from "../../context/Search&CartContext";
import { ArrowBigLeft, ArrowLeft, ArrowLeftFromLine, ArrowRightFromLine, LocateIcon, MapPinned, StepBack, StepForward, Trash2, X } from "lucide-react";
import { Axios } from "../../utils/Axiox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const ViewCart = () => {

    const [refrescartpage, setRefreshCartPage] = useState(false)
    const [discountCode, setDiscountCode] = useState(false)
    const { cartedItem, total = 0, refreshContext, setRefreshContext } = useContext(Cartcontext);
    const { cartCount, setCartcount, refresh, setRefresh, user } = useContext(AppContext)
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cod");

    console.log('carted item',cartedItem);
    

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
            toast.error("Product Remove from the Cart");
        } catch (error) {
            console.log(error);

            toast.error("Failed to remove product. Please try again.");
        } finally {
            setRefreshContext(!refreshContext);
        }
    };

    const proceedToPayment = async () => {
        try {
            const order = await Axios.get(`/user/placeOrder/${paymentMethod}`)
            setCartcount(0)
            toast.success(order.data.message);
            setRefresh(!refresh)
            navigate("/user/orders");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    const totalItems = cartedItem?.shopProduct?.reduce((acc, shop) => acc + shop.products.length, 0) || 0;

    return (
        <div className="w-full h-[98%]  flex items-center justify-center pb-12 ">
            <div className="w-[95%] h-[800px] bg-white  rounded-xl  relative flex" style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px" }} >
                <div onClick={()=>navigate('/user/home')} className="absolute top-8 left-12 flex items-center gap-1  text-[#292f3f] rounded-lg w-fit cursor-pointer  transition">
                    <ArrowLeft size={'17'} className="font-extrabold" />
                    <p className="text-[13px]  font-extrabold">Continue shopping</p>
                </div>
                <div className="w-[72%] h-full flex flex-col items-start  justify-end gap-4  pl-16">
                    <div className="w-full flex items-end gap-16">
                        <p className="text-[40px] text-[#292f3f] font-extrabold">Shopping cart</p>
                        <p className="text-[15px] text-[#292f3f] font-extrabold mb-2">{totalItems != 0 ? `${totalItems} Items ` : ""}</p>
                    </div>
                    <div className="w-full h-[80%]  overflow-y-scroll hide-scrollbar pb-10">
                        {cartedItem?.shopProduct?.length > 0 ? (
                            cartedItem.shopProduct.map((shop) => (
                                <div key={shop._id} className="">
                                    <p className="text-xl font-semibold  my-5" style={{ letterSpacing: "10px", wordSpacing: "5px" }}>{shop.shopId.shopname}</p>
                                    <ul>
                                        {shop.products.map((product) => (
                                            <li key={product._id} className="flex items-center mt-2 justify-between ">
                                                <div className="h-36 w-full flex items-center gap-8">
                                                    <div className="w-[200px] h-full p-5 bg-gray-100 rounded-lg">
                                                        <img className="w-full h-full rounded-lg" src={product.productId.productimage} alt={product.productId.productname} />
                                                    </div>
                                                    <div className="flex h-[80%]  gap-1  w-[70%] justify-between">
                                                        <div className="flex flex-col justify-evenly w-[75%]">
                                                            <h3 className="text-[20px] text-[#292f3f] font-extrabold">{product.productId.productname}</h3>
                                                            <p className="text-sm text-gray-500">{product.productId.productType} {product.productId.category} ,{product.productId.modelnumber}</p>
                                                            <div className="flex items-center gap-2">
                                                                <StepBack strokeWidth={1} size={19} color="gray" onClick={() => quantityChange(shop.shopId._id, product.productId._id, false)} />

                                                                <p className="text-sm text-gray-500">{product.quantity}</p>
                                                                <StepForward strokeWidth={1} size={19} color="gray" onClick={() => quantityChange(shop.shopId._id, product.productId._id, true)} />

                                                            </div>

                                                        </div>
                                                        <div className="w-[25%] flex justify-evenly items-center ">
                                                            <p className="font-semibold">₹ {product.productId.price}</p>
                                                            <button
                                                                className="h-7 bg-gray-900 opacity-15 text-white rounded-full p-1 hover:bg-red-600 hover:opacity-100"
                                                                onClick={() => deletedCartedProduct(shop.shopId._id, product.productId._id)}
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">Your cart is empty</p>
                        )}
                    </div>
                </div>
                {
                    cartedItem?.shopProduct?.length > 0 &&
                    <div className="flex flex-col justify-around w-[28%] h-ful bg-[#F6F6F6] rounded-xl p-6" >
                        <div className="  flex items-center justify-between">
                            {
                                user && (
                                    <>
                                        <div className="flex flex-col gap-1.5 w-[80%]">
                                            <p className="text-[18px] text-[#292f3f] font-extrabold" style={{ letterSpacing: "5px", wordSpacing: "7px" }}>{user.fullName}</p>
                                            <p className="text-[16px] text-[#292f3f] italic">{user.email}</p>
                                            <p className="text-[16px] text-[#292f3f] italic">+91 {user.phoneNumber}</p>
                                            <p className="text-[14px] text-[#292f3f] italic flex gap-3"> {user.locationName}</p>
                                        </div>
                                        <div className=" w-[20%] flex justify-end italic">
                                            <p className="text-blue-600 cursor-pointer"><u>Edit</u></p>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <div className="flex text-gray-400" disabled>
                            <div className="flex flex-col gap-1 w-[80%]">
                                <p className="text-[18px]  font-extrabold" style={{ letterSpacing: "5px", wordSpacing: "7px" }}>Card Deatils</p>
                                <p className="text-[14px]  italic">Credit Card </p>
                                <p> <span className="text-xs italic">(online pay not available)</span></p>
                                <div className="flex gap-8 items-center">
                                    <p className="text-[14px]  italic">**** **** **** 5612</p>
                                    <img className="w-7 h-7 m-0" src="https://i.pinimg.com/736x/56/fd/48/56fd486a48ff235156b8773c238f8da9.jpg" alt="card" />
                                </div>

                            </div>
                            <div className=" w-[20%] flex justify-end italic">
                                <p className="text-gray-400 cursor-pointer"><u>Edit</u></p>
                            </div>
                        </div>

                        <div className="flex text-[#292f3f]" disabled>
                            <div className="flex flex-col gap-3 w-full">
                                <div>
                                    <p className="text-[18px]  font-extrabold">Do you have any discount code?</p>
                                    <p className="text-[14px]  italic">Only one discount code  per order can be applied</p>
                                </div>
                                <div className="flex flex-col  items-center ">
                                    <div className="flex w-full gap-2">
                                        <input className="border border-gray-400 px-2 py-1 w-full" type="text" placeholder="Your code here" />
                                        <button onClick={()=>setDiscountCode(true)} className="text-xs border border-gray-400 font-extrabold bg-[#292f3f] text-white px-3 py-2">APPLY</button>
                                    </div>
                                    {
                                        discountCode &&
                                        <div>
                                            <small className="italic text-red-600">Invalid discount code</small>
                                        </div>

                                    }

                                </div>

                            </div>
                        </div>

                        {cartedItem?.shopProduct?.length > 0 && (
                            <div>
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
                                    className="w-full bg-[#292f3f] hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        )}
                    </div>
                }

            </div>
        </div >
    );
};

export default ViewCart;
