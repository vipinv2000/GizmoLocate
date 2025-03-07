import React, { useContext, useEffect } from "react";
import { Axios } from "../../utils/Axiox";
import { AppContext } from "../../context/AppContext";
import { FaBoxOpen, FaShoppingCart, FaTruck } from "react-icons/fa";

const NotificationPage = () => {
    const { notification, setNotifications, dark } = useContext(AppContext);

    const toggleNotification = async () => {
        try {
            const { data } = await Axios.get("/user/togglenotification");
            console.log("Toggle Notification", data.Notifications);
            setNotifications(data.Notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        toggleNotification();
    }, []);

    // Function to determine which icon to display based on the message content
    const getNotificationIcon = (message) => {
        if (message.toLowerCase().includes("placed")) return <FaShoppingCart className="text-blue-600 text-xl" />;
        if (message.toLowerCase().includes("pickup")) return <FaBoxOpen className="text-green-600 text-xl" />;
        if (message.toLowerCase().includes("delivered")) return <FaTruck className="text-orange-600 text-xl" />;
        return null;
    };

    return (
        <div className={`flex h-screen justify-center min-h-auto ${dark ? "bg-[#141414] text-white" : "bg-gray-100 text-black"}`}>
            <div className="w-full max-w-7xl p-6 rounded-lg mt-7 flex flex-col">
                <p className="text-2xl font-semibold">Notifications</p>
                <div className="space-y-3">
                    {notification && notification.messages && notification.messages.length > 0 ? (
                        notification.messages.slice().reverse().map((msg) => (
                            <div key={msg._id} className="mt-3 relative flex flex-col justify-start rounded-lg opacity-65">
                                <div className="w-full p-6 rounded-lg flex items-center space-x-2">
                                    {getNotificationIcon(msg.notification)}
                                    <p className="font-extrabold">{msg.notification}</p>
                                </div>
                                <p className="text-sm mt-2 italic">{new Date(msg.dateTime).toLocaleString()}</p>
                                <div className="h-full w-full rounded-lg bg-gradient-to-t from-green-600 opacity-25 absolute"></div>
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
