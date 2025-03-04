import React, { useContext, useEffect } from 'react';
import { Axios } from '../../utils/Axiox';
import { AppContext } from '../../context/AppContext';

const NotificationPage = () => {
    const { notification, setNotifications } = useContext(AppContext);

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
        <div className="flex  justify-center min-h-auto bg-gray-100">
            <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h1>
                <div className="space-y-3">
                    {notification && notification.messages && notification.messages.length > 0 ? (
                        notification.messages.slice().reverse().map((msg) => (
                            <div key={msg._id} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                                <p className="text-gray-700 font-medium">{msg.notification}</p>
                                <p className="text-sm text-gray-500">{new Date(msg.dateTime).toLocaleString()}</p>
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
