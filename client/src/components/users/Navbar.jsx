import React, { useContext, useEffect, useState } from 'react'
import { SearchContextProvide } from '../../context/Search&CartContext'
import Searchproducts from './Search'
import { ArrowBigRight, Bell, Menu, User } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const { toggleMenu, setToggleMenu, ennableSearchbar, isAuth, user, notification } = useContext(AppContext)
    const navigate = useNavigate()

    return (

        <header className='bg-white '>
            <div className="flex items-center justify-between px-5 py-5  fixed w-full z-10 h-24 bg-white">
                <div className="py-6 flex items-center justify-center gap-3.5">
                    <button className=" hover:bg-gray-100 rounded-full">
                        <Menu className="h-6 w-6 text-gray-600" onClick={() => setToggleMenu(!toggleMenu)} />
                    </button>
                    <div className='h-16 flex flex-col justify-end'>
                        <h2 className="text-2xl font-bold text-gray-900 m-0 p-0">GizmoLocate</h2>
                        <div className='flex items-center  gap-1 cursor-pointer' onClick={() => navigate('/user/settings')}>
                            <p className='text-[12px] m-0 p-0 text-red-700'>{user?.locationName} </p>
                            <ArrowBigRight className="w-3 h-3 text-red-700" />
                        </div>
                    </div>

                </div>
                <div className='w-[50%]'>{
                    ennableSearchbar &&
                    <SearchContextProvide>
                        <Searchproducts />
                    </SearchContextProvide>
                }

                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full relative">
                        <div className='' onClick={() => navigate('/user/viewNotification')}>
                            <Bell className="h-6 w-6 text-gray-600" />
                            {
                                notification && notification.isViewed &&
                                <div className="bg-red-600 absolute top-1 right-1 rounded-full w-4 h-4 flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">!</span>
                                </div>
                            }

                        </div>
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