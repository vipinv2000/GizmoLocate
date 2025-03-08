import React from 'react'
import { assets } from '../assets/assets'
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';

const First_page = () => {
    return (
        <div className='relative  w-full h-[99vh] flex flex-col items-center justify-center   text-gray-800 overflow-y-scroll hide-scrollbar'>



            <div className='absolute top-20 left-20 flex flex-col gap-2.5'>

                <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
                    <img src={assets.wavingRobo} className='w-90 h-90 rounded-full mt-8 mb-8' alt="" />
                    <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hi there! Explore and enjoy  <img className='aspect-square w-8' src={assets.hand_wave} alt="" /></h1>
                    <h1 className='text-3xl sm:text-5xl font-semibold mb-4  ' style={{ letterSpacing: "8px", wordSpacing: "8px" }}>Welcome to GizmoLocate</h1>
                    <p className='mb-8 max-w-md '>GizoLocate—bridging the gap between buyers and sellers, making gadget shopping faster, smarter, and more local!</p>
                    <MdKeyboardDoubleArrowDown size={50} className="text-gray-400 up-down-animation" />
                </div>
                {/* User Frame */}

                <div className=' flex flex-col gap-10 mt-10'>
                    <div className='flex sm:flex-row flex-col   w-full items-center justify-between  '>

                        <div className=' w-110 h-90 '>
                            <img src={assets.firstImage} className='w-full h-full  mb-6' alt="" />

                        </div>
                        <div className=' h-full flex   justify-center w-[90%]'>
                            <div className=' w-10/12'>
                                <h1 className='flex items-center gap-2 text-xl sm:text-3xl  mb-2 font-extrabold'>Hi Customer,</h1>
                                <p className='w-11/12 mt-2'>Struggling to find the perfect electronic device, mobile, or PC gadget? Online shopping can be time-consuming, but <span className='font-extrabold'>GizoLocate</span> makes it effortless! Discover the best deals on gadgets near you and get them quickly—right when you order. Because at GizoLocate, your happiness is our greatest wealth!

                                    No more waiting for long deliveries or unreliable listings. Find what you need, when you need it—right around the corner!</p>
                                <p className='italic mt-4'>This feature is just for you, the seeker of the perfect product. Happy shopping!</p>
                            </div>

                            <div className='flex justify-center items-center'>
                                <button className="py-2 px-3 font-extrabold">
                                    <a href="/user" target="_blank" rel="noopener noreferrer">Ready To Shop</a>
                                </button>
                                <MdKeyboardDoubleArrowRight size={26} />
                            </div>
                        </div>


                    </div>

                    {/* Shop Frame */}

                    <div className='flex sm:flex-row flex-col   w-full items-center justify-between  '>

                        <div className=' w-100 h-80 '>
                            <img src={assets.shop_3D} className='w-[80%] h-[80%]  mb-6' alt="" />

                        </div>
                        <div className=' h-full flex   justify-center w-[90%]'>
                            <div className=' w-10/12'>
                                <h1 className='flex items-center gap-2 text-xl sm:text-3xl  mb-2 font-extrabold'>Hi Shop        ,</h1>
                                <p className='w-11/12 mt-2'>Own a shop? Facing a drop in business? Don’t worry! GizoLocate helps boost your sales by letting you upload your electronic products and gadgets. Customers can easily find and order from you, bringing more sales your way.

                                    At GizoLocate, we connect buyers and sellers for a seamless shopping experience—because your success is our mission!</p>
                                <p className='italic mt-4'>This feature is exclusively for you, the seller of top-quality gadgets. Grow your business with us!</p>
                            </div>

                            <div className='flex justify-center items-center'>
                                <button className="py-2 px-3 font-extrabold">
                                    <a href="/shop" target="_blank" rel="noopener noreferrer">Go To Shop</a>
                                </button>
                                <MdKeyboardDoubleArrowRight size={26} />
                            </div>
                        </div>


                    </div>

                    {/* Adminframe */}

                    <div className='flex sm:flex-row flex-col   w-full items-center justify-between  '>

                        <div className=' w-100 h-80 '>
                            <img src={assets.Admin_photo} className='w-[80%] h-[80%] mb-6' alt="" />

                        </div>
                        <div className=' h-full flex   justify-center w-[90%]'>
                            <div className=' w-10/12'>
                                <h1 className='flex items-center gap-2 text-xl sm:text-3xl  mb-2 font-extrabold'>Hi Admin,</h1>
                                <p className='w-11/12 mt-2'>As the admin of GizoLocate, we empower shop owners to grow their business effortlessly. List your electronic products and gadgets, reach more customers, and maximize sales.

                                    We ensure a seamless experience for both sellers and buyers—because at GizoLocate, your success is our mission!</p>
                                <p className='italic mt-4'>This feature is exclusively for verified sellers on GizoLocate. List your products, connect with customers, and grow your business!</p>
                            </div>

                            <div className='flex justify-center items-center'>
                                <button className="py-2 px-3 font-extrabold">
                                    <a href="/admin" target="_blank" rel="noopener noreferrer">Admin</a>
                                </button>

                                <MdKeyboardDoubleArrowRight size={26} />
                            </div>
                        </div>


                    </div>
                </div>

            </div>

            <div></div>
            <div></div>
        </div>
    )
}

export default First_page