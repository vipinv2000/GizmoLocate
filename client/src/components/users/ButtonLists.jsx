import React, { useContext, useEffect, useState } from 'react'
import { ProductContext } from '../../context/ProductContext'
import { AppContext } from '../../context/AppContext'

const ButtonLists = ({ name, first, id }) => {


    const { fetchedProducts, setShowProducts } = useContext(ProductContext)
    const { selectedtab, setSelectedTab, dark } = useContext(AppContext)

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
            <button
                onClick={() => ShowSelectedItem(name, id)}
                className={`py-2 px-3 m-2 w-auto font-medium rounded-lg text-sm whitespace-nowrap overflow-hidden text-ellipsis 
        ${selectedtab === id
                        ? dark
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        : dark
                            ? "bg-[#3F3F3F] hover:bg-[#4b4b4b] text-white opacity-65"
                            : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                {name}
            </button>

        </div >
    )
}

export default ButtonLists