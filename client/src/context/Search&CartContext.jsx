import { createContext, useEffect, useState } from "react";
import { Axios } from "../utils/Axiox";

export const Searchcontext = createContext(null)

export const Cartcontext = createContext(null)

export const SearchContextProvide = ({ children }) => {
    const [productSearch, setProductSearch] = useState({})

    const UpdateProductSearch = function (key, value) {
        setProductSearch({
            ...productSearch,
            [key]: value
        })
    }
    const value = {
        productSearch,
        UpdateProductSearch
    }
    return (
        <Searchcontext.Provider value={value}>
            {children}
        </Searchcontext.Provider>
    )
}

export const CartContextProvider = ({ children }) => {

    const [cartedItem, setCartedItem] = useState(null)
    const [total, setTotal] = useState(null)
    const [refreshContext, setRefreshContext] = useState(false)

    const getCartedItems = async () => {

        try {
            const { data } = await Axios.get('/user/viewCart');
            setCartedItem(data.showCart)
            setTotal(data.total)
        } catch (e) {

        }
    }

    useEffect(() => {
        getCartedItems()
    }, [refreshContext])

    const value = {
        cartedItem,
        total,
        refreshContext,
        setRefreshContext
    }

    return (
        <Cartcontext.Provider value={value}>
            {children}
        </Cartcontext.Provider>
    )

}