import React, { useState } from 'react'
import { useEffect } from 'react'
import { Axios } from '../../utils/Axiox'

const ViewCart = () => {

    const [cartedItem, setCartedItem] = useState([])
    const [total, setTotal] = useState([])

    const getCartedItems = async () => {
        
        const { data } =await Axios.get('/user/viewCart');
        console.log(data.showCart);
        setCartedItem(data.showCart)
        setTotal(data.total)
    }

    useEffect(() => {
        getCartedItems()
    }, [])

    return (
        <div>

        </div>
    )
}

export default ViewCart