import { createContext, useState } from "react";

export const Searchcontext = createContext(null)

export const SearchContextProvide = ({children})=>{
    const [productSearch,setProductSearch] = useState({})

    const UpdateProductSearch =function (key,value){
        setProductSearch({
            ...productSearch,
            [key]:value
        })
    }
    const value={
        productSearch,
        UpdateProductSearch
    }
    return (
        <Searchcontext.Provider value={value}>
            {children}
        </Searchcontext.Provider>
    )
}