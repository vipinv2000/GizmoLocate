import React, { useContext, useState, useEffect } from 'react';
import { Searchcontext } from '../../context/Search&CartContext';
import { Axios } from '../../utils/Axiox';
import { IoSearch } from "react-icons/io5";
import { ProductContext } from '../../context/ProductContext';

const Searchproducts = () => {
    const [searchResult, setSearchResult] = useState('');
    const [searchInfo, setSearchInfo] = useState([]);
    const [searchFocus, setSearchFocus] = useState(false);
    const { productSearch, UpdateProductSearch } = useContext(Searchcontext);
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
                console.log("onceee",true);
                
            }
            else {
                const { data } = await Axios.get(`/user/giveSearchResult/${result}`);
                console.log("clecked search REsult", data.result)
                setShowProducts(data.result)
                StorePrevSearcHProducts(result, data.result)
                console.log("onceee",false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            console.log(errorMessage);
        }

    }

    return (
        <div>
            <div className='w-full relative' onMouseLeave={() => setSearchFocus(false)} onMouseEnter={() => setSearchFocus(true)}>
                <div className='flex items-center justify-center gap-3 w-full h-[3.2rem] px-4 py-2.5 rounded-full border border-gray-200 '>
                    <IoSearch className='text-gray-400 size-5' />
                    <input
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setShowProducts(fetchedProducts)
                            }
                            setSearchResult(e.target.value)
                        }}
                        value={searchResult}
                        className='flex items-center bg-transparent outline-none text-black w-full '
                        type="text"
                        placeholder='Find products'
                    />
                </div>
                {searchFocus && searchResult.trim() && (
                    <div className='w-full absolute z-10 max-h-90 overflow-y-scroll flex flex-col gap-2 rounded-bl-md border border-gray-100 rounded-2xl py-3 bg-white text-black scrollbar-hide'>
                        {searchInfo.length === 0 ? (
                            <div className='w-full flex gap-3  px-5 py-2'>
                                <IoSearch className='text-gray-400 size-5' />
                                <h1>No results found</h1>
                            </div>
                        ) : (
                            searchInfo.map((product, index) => (
                                <div className='w-full flex gap-3 hover:bg-gray-100 px-5 py-2' key={index} onClick={() => sendSearchResult(product)}>
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
