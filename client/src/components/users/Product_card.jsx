import { Heart, X } from 'lucide-react'
import React, { useContext } from 'react'
import { Axios } from '../../utils/Axiox'
import { ProductContext } from '../../context/ProductContext'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import { assets } from '../../assets/assets'

const Product_card = ({ pro }) => {

    const { setwidhListToggle, wishlistToggle } = useContext(ProductContext)

    const navigate = useNavigate()

    const toggleWishList = async (proId) => {
        try {
            await Axios.get(`/user/addwishlist/${proId}`)
            setwidhListToggle(!wishlistToggle)
        } catch (error) {
            console.error("Error updating wishlist:", error)
        }
    }

    const playSound = () => {
        const audio = new Audio(assets.popsound);
        audio.play();
    };

    return (


        <div className="w-[300px] flex flex-col grow relative  rounded-lg  overflow-hidden mt-4" onDoubleClick={() => {
            toggleWishList(pro._id)
            playSound();
        }}>
            {/* Remove button */}
            {
                pro.quantity === 0 ? (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                    </span>
                ) : (

                    <motion.div
                        className="absolute top-4 right-4 cursor-pointer"
                        initial={{ scale: 1 }}
                        whileTap={{ scale: 0.8 }} // Shrinks when clicked
                        whileHover={{ scale: 1.2 }} // Slight enlargement on hover
                        animate={{ scale: pro.wished ? 1.2 : 1 }} // Enlarges when wished
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        onClick={() => {
                            toggleWishList(pro._id)
                            playSound();
                        }}
                    >
                        <Heart
                            className={`h-6 w-6 border border-none opacity-65 ${!pro.wished && "opacity-25"}`}
                            fill={pro.wished ? "red" : "white"}
                            stroke="none"
                            strokeWidth={1} // Adjust if needed
                        />

                    </motion.div>

                )
            }
            <div className=' h-full flex flex-col' onClick={() => navigate(`/user/viewProduct/${pro._id}`)}>

                <img src={pro.productimage} alt={pro.productname} className="w-full h-40 object-cover" />
                <div className="h-full    flex flex-col gap-1  ">

                    <div className=' w-full flex flex-col pb-2 '>
                        <div className='flex '>
                            <div className=' w-[16%] flex  justify-start'>
                                <img className='w-10 h-10 rounded-full mt-2 border border-gray-400' src="https://img.freepik.com/free-vector/shop-with-sign-open-design_23-2148544029.jpg" alt="shop" />
                            </div>
                            <div className='w-[84%] text-start'>
                                <div className=''>
                                    <p className='text-xs tracking-widest mt-2' style={{ letterSpacing: "7px" }}>{pro.productType}</p>
                                    <p className="text-lg font-semibold text-[20px]">{pro.productname}</p>
                                    <div className='bg-black h-[1px] w-[30%]'></div>
                                </div>

                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-[13px] italic mt-2">{pro.modelnumber}</p>
                            <p className="text-gray-600 text-sm italic" style={{
                                fontSize: '10px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>{pro.description}</p>
                            <p className="text-sm text-gray-500 font-extrabold mt-2" style={{ wordSpacing: "7px" }}>Price : {pro.price}<span className=' text-[12px]'>/-</span> </p>
                            <p
                                className="text-gray-500"
                                style={{
                                    fontSize: '13px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',

                                }}
                            >
                                Model: {pro.modelnumber}, #{pro.productType}, #{pro.category} #electronics
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Product_card
