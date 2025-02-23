import React, { useContext, useState, useEffect } from 'react';
import { Searchcontext } from '../../context/SearchContext';
import { Axios } from '../../utils/Axiox';
import { IoSearch } from "react-icons/io5";

const Searchproducts = () => {
    const [searchResult, setSearchResult] = useState('');
    const [searchInfo, setSearchInfo] = useState([]);
    const [searchFocus, setSearchFocus] = useState(false);
    const { productSearch, UpdateProductSearch } = useContext(Searchcontext);

    useEffect(() => {
        if (!searchResult.trim()) {
            setSearchInfo([]);
            return;
        }

        const timer = setTimeout(() => {
            if (productSearch[searchResult]) {
                setSearchInfo(productSearch[searchResult]);
            } else {
                searchQuery();
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [searchResult]);

    const searchQuery = async () => {
        try {
            const result = await Axios.get(`/user/productSearch/${searchResult}`);
            UpdateProductSearch(searchResult, result.data.searchResult || []);
            setSearchInfo(result.data.searchResult || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const sendSearchResult = async(result) => {
        const {data} = await Axios.get(`/user/giveSearchResult/${result}`);
        console.log(data.result)
        
    }

    return (
        <div className='mt-7'>
            <div className='w-full relative' onMouseLeave={() => setSearchFocus(false)} onMouseEnter={() => setSearchFocus(true)}>
                <div className='flex items-center justify-center gap-3 w-full h-[3.4rem] px-4 py-2.5 rounded-full ' style={{
                    boxShadow:
                        "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 23px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                }}>
                    <IoSearch className='text-gray-400 size-5' />
                    <input
                        onChange={(e) => setSearchResult(e.target.value)}
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
                                <div className='w-full flex gap-3 hover:bg-gray-100 px-5 py-2' key={index} onClick={()=>sendSearchResult(product)}>
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
