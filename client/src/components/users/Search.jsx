import React, { useContext, useState, useEffect } from 'react';
import { Searchcontext } from '../../context/Search&CartContext';
import { Axios } from '../../utils/Axiox';
import { IoSearch } from "react-icons/io5";
import { ProductContext } from '../../context/ProductContext';
import { AppContext } from '../../context/AppContext';

const Searchproducts = () => {
    const [searchResult, setSearchResult] = useState('');
    const [searchInfo, setSearchInfo] = useState([]);
    const [searchFocus, setSearchFocus] = useState(false);
    const { productSearch, UpdateProductSearch } = useContext(Searchcontext);
    const { dark } = useContext(AppContext);
    const { showProducts, setShowProducts, fetchedProducts, StorePrevSearcHProducts, productsHistory } = useContext(ProductContext);

    useEffect(() => {
        if (!searchResult.trim()) {
            setSearchInfo([]);
            return;
        }

        const timer = setTimeout(() => {
            if (productSearch[searchResult]) {
                setSearchInfo(productSearch[searchResult]);
                console.log(true);

            } else {
                searchQuery();
                console.log(false);

            }
        }, 200);

        return () => clearTimeout(timer);
    }, [searchResult]);

    const searchQuery = async () => {
        try {
            const result = await Axios.get(`/user/productSearch/${searchResult}`);
            console.log(result);

            UpdateProductSearch(searchResult, result.data.searchResult || []);
            setSearchInfo(result.data.searchResult || []);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            console.log(errorMessage);

        }
    };

    const sendSearchResult = async (result) => {
        try {
            if (productsHistory[result]) {
                setShowProducts(productsHistory[result])
                console.log("onceee", true);

            }
            else {
                const { data } = await Axios.get(`/user/giveSearchResult/${result}`);
                console.log("clecked search REsult", data.result)
                setShowProducts(data.result)
                StorePrevSearcHProducts(result, data.result)
                console.log("onceee", false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            console.log(errorMessage);
        }

    }

    return (
        <div>
            <div className='w-full relative  flex justify-center' onMouseLeave={() => setSearchFocus(false)} onMouseEnter={() => setSearchFocus(true)}>
                <div className='flex items-center justify-center gap-3 w-[80%] h-[2.7rem] px-4 py-2.5 rounded-full border border-gray-700 '>
                    <IoSearch className={`size-5  ${dark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`} />
                    <input
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setShowProducts(fetchedProducts);
                            }
                            setSearchResult(e.target.value);
                        }}
                        value={searchResult}
                        className={`flex items-center bg-transparent outline-none w-full ${dark ? "text-white placeholder-gray-300" : "text-black placeholder-gray-500"
                            }`}
                        type="text"
                        placeholder="Search"
                    />

                </div>
                {searchFocus && searchResult.trim() && (
                    <div className={`w-[80%] absolute z-10 mt-11 ${dark ? "bg-[#212121]" : "bg-white text-black border-gray-100"} max-h-90 overflow-y-scroll flex flex-col gap-2 rounded-bl-md  rounded-2xl py-3  scrollbar-hide`}>
                        {searchInfo.length === 0 ? (
                            <div className='w-full flex gap-3  px-5 py-2'>
                                <IoSearch className='text-gray-400 size-5' />
                                <h1>No results found</h1>
                            </div>
                        ) : (
                            searchInfo.map((product, index) => (
                                <div className={`w-full flex gap-3 ${dark ? "hover:bg-[#383838]" : "hover:bg-gray-100 "} px-5 py-2`} key={index} onClick={() => sendSearchResult(product)}>
                                    <IoSearch className='text-gray-400 size-5' />
                                    <h1>{product}</h1>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Searchproducts;
