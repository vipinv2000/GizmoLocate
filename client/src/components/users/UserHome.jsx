import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ProductContext } from "../../context/ProductContext";
import Product_card from "./Product_card";

const UserHome = () => {
    const { setEnnablesearchBar, setToggleMenu } = useContext(AppContext);
    const { showProducts } = useContext(ProductContext);

    useEffect(() => {
        setEnnablesearchBar(true);
        setToggleMenu(false);
        return () => {
            setEnnablesearchBar(false);
            setToggleMenu(true);
        };
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Available Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  place-items-center">
                {showProducts.map((pro) => (
                    <Product_card key={pro._id} pro={pro}/>
                ))}
            </div>
        </div>
    );
};

export default UserHome;
