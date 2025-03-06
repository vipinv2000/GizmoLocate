import React, { useContext, useEffect } from 'react';
import { Axios } from '../../utils/Axiox';
import { AppContext } from '../../context/AppContext';

const NotificationPage = () => {
    const { notification, setNotifications,dark } = useContext(AppContext);

    const toggleNotification = async () => {
        try {
            const { data } = await Axios.get('/user/togglenotification');
            console.log("Toggle Notification", data.Notifications);
            setNotifications(data.Notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        toggleNotification();
    }, []);

    return (
        <div className={`flex h-screen  justify-center min-h-auto ${dark ? "bg-[#141414] text-white" : "bg-gray-100 text-black"}`}>
            <div className="w-full   max-w-7xl p-6 rounded-lg mt-7 flex flex-col ">
                <p className="text-2xl font-semibold  ">Notifications</p>
                <div className="space-y-3 ">
                    {notification && notification.messages && notification.messages.length > 0 ? (
                        notification.messages.slice().reverse().map((msg) => (
                            <div key={msg._id} className=" mt-3 relative   flex flex-col justify-start  rounded-lg  opacity-65 ">
                                <div className='w-full p-6 rounded-lg '>
                                    <p className=" font-extrabold">{msg.notification}</p>
                                    <p className="text-sm  mt-2 italic">{new Date(msg.dateTime).toLocaleString()}</p>
                                </div>
                                <div className='h-full w-full rounded-lg bg-gradient-to-t from-green-600 opacity-25 absolute'></div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No notifications available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
