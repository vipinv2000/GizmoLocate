import { createContext, useEffect, useState } from "react";
import { Axios } from "../utils/Axiox";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
    const [fetchedProducts, setFetchedProducts] = useState([])
    const [showProducts, setShowProducts] = useState([])
    const [productsHistory, setProductsHistory] = useState([])
    const [wishlistToggle,setwidhListToggle] = useState(false)

    const StorePrevSearcHProducts = (key, searchedProduct) => {
        setProductsHistory({
            ...productsHistory,
            [key]: searchedProduct
        })
    }

    const fetchProductforDisplay = async () => {
        try {
            const { data } = await Axios.get('/user/getProdects');
            console.log("Top Product for desiplay", data);
            setFetchedProducts(data.products)
            setShowProducts(data.products)

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            console.log(errorMessage);
        }
    }

    useEffect(() => {
        fetchProductforDisplay()
    }, [wishlistToggle])

    const value = {
        fetchedProducts,
        setFetchedProducts,
        showProducts,
        setShowProducts,
        StorePrevSearcHProducts,
        productsHistory,
        setwidhListToggle,
        wishlistToggle
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}
