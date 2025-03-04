import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { Axios } from '../../utils/Axiox'
import toast from 'react-hot-toast'

const Admin_Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { isadmin,setIsAdmin, refresh, setRefresh, } = useContext(AppContext)
    const navigate = useNavigate()

    const DoLogout = async () => {
        try {
            const { data } = await Axios.get('/admin/logout');
            toast.success(data.message)
            setRefresh(!refresh)
            setIsAdmin(false)
            navigate('/admin/login')
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <nav className="fixed w-full  z-10 p-4 flex justify-between items-center ">
            {/* Logo */}
            <div className="ml-4">
                <a href="/">
                    <img className="w-16" src="https://s.tmimgcdn.com/scr/1200x750/404800/smartphone-logo-vector-modern-phone-designv49_404866-original.jpg" alt="Logo" />
                </a>
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden cursor-pointer text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            {/* Navigation Links */}
            <div className={`absolute md:relative top-16 md:top-auto left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 flex flex-col md:flex-row items-center gap-8 md:gap-16 transition-all duration-300 ${menuOpen ? "block" : "hidden md:flex"}`}>
                <button onClick={() => navigate("/admin/accept-shops")} className="text-gray-700 text-lg hover:text-blue-600 transition">Accept Shops</button>

                <button onClick={() => navigate("/admin/view-shops")} className="text-gray-700 text-lg" >Shops</button>
                <button onClick={() => navigate("/admin/view-users")} className="text-gray-700 text-lg" >Users</button>
                <button className="text-gray-700 text-lg">About</button>
            </div>

            {/* Authentication Links */}
            {
                isadmin ? (
                    <div className={`mr-9 absolute md:relative top-64 md:top-auto left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 flex flex-col md:flex-row items-center gap-3 transition-all duration-300 ${menuOpen ? "block" : "hidden md:flex"}`}>
                        <button className="text-gray-700 font-bold" onClick={DoLogout}>Logout</button>
                    </div>
                ) :
                    (
                        <div className={`mr-9 absolute md:relative top-64 md:top-auto left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 flex flex-col md:flex-row items-center gap-3 transition-all duration-300 ${menuOpen ? "block" : "hidden md:flex"}`}>
                            <button className="text-gray-700 font-bold" onClick={()=>navigate('/admin/login')}>Login</button>
                        </div>
                    )
            }

        </nav>
    )
}

export default Admin_Navbar