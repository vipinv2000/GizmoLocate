import { Heart, } from 'lucide-react'
import React, { useContext } from 'react'
import { Axios } from '../../utils/Axiox'
import { ProductContext } from '../../context/ProductContext'
import { useNavigate } from 'react-router-dom'

const Product_card = ({ pro }) => {

    const { setwidhListToggle, wishlistToggle } = useContext(ProductContext)

    const navigate = useNavigate()

    const toggleWishList = async (proId) => {
        try {
            const wished = await Axios.get(`/user/addwishlist/${proId}`)
            setwidhListToggle(!wishlistToggle)
        } catch (error) {

        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 relative" >
            {/* Out of Stock Badge */}
            {pro.quantity === 0 ? (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                </span>
            ) : (
                <div>
                    <Heart className="h-5 w-5 mr-3 absolute top-2 right-2" fill={pro.wished ? "red" : "none"} onClick={() => toggleWishList(pro._id)} />

                </div>
            )}

            {/* Product Image */}
            <div  onClick={() => navigate(`/user/viewProduct/${pro._id}`)}>
                <img
                    src={pro.productimage}
                    alt={pro.productname}
                    className="w-full h-40 object-cover rounded-md"
                />

                {/* Product Details */}
                <div className="mt-3">
                    <h3 className="text-lg font-semibold">{pro.productname}</h3>
                    <p className="text-sm text-gray-500">{pro.category}</p>
                    <p className="text-md font-medium text-blue-600">₹{pro.price}</p>
                    <p className="text-sm text-gray-600">Model: {pro.modelnumber}</p>
                    <p className="text-sm text-gray-600">Type: {pro.productType}</p>
                </div>
            </div>

            {/* Buy Button */}
        </div>
    )
}

export default Product_card