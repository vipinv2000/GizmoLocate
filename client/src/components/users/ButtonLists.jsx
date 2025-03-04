import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import { AppContext } from '../../context/AppContext'

const ButtonLists = ({ name, first, id }) => {


    const { fetchedProducts, setShowProducts } = useContext(ProductContext)
    const { selectedtab,setSelectedTab } = useContext(AppContext)

    const ShowSelectedItem = (name, id) => {

        if (name === "All") {
            setShowProducts(fetchedProducts)
        } else {
            const selectedItems = fetchedProducts.filter(item => {
                return item.category.toUpperCase() === name.toUpperCase()
            });
            console.log("Selected items", selectedItems);
            setShowProducts(selectedItems)
        }
        setSelectedTab(id)

    }
    return (
        <div className='grow'>
            <button onClick={() => ShowSelectedItem(name, id)} className={`py-2 px-3 m-2 w-auto font-medium rounded-lg text-sm whitespace-nowrap overflow-hidden text-ellipsis ${selectedtab === id ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}>{name}</button>
        </div >
    )
}

export default ButtonLists