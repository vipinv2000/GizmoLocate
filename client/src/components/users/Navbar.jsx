import React, { useContext } from 'react'
import { SearchContextProvide } from '../../context/Search&CartContext'
import Searchproducts from './Search'
import { Bell, Menu, User } from 'lucide-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

    const { toggleMenu, setToggleMenu, ennableSearchbar } = useContext(AppContext)


    return (

        <header className='bg-white '>
            <div className="flex items-center justify-between px-5 py-5  fixed w-full z-10 h-24 bg-white">
                <div className="py-6 flex items-center justify-center gap-3.5">
                    <button className=" hover:bg-gray-100 rounded-full">
                        <Menu className="h-6 w-6 text-gray-600" onClick={() => setToggleMenu(!toggleMenu)} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">GizmoLocate</h2>
                </div>
                <div className='w-[50%]'>{
                    ennableSearchbar &&
                    <SearchContextProvide>
                        <Searchproducts />
                    </SearchContextProvide>
                }

                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Bell className="h-6 w-6 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <User className="h-6 w-6 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar