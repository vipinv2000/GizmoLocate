import Notify from "../models/notify_model.js";

export const userNotify = async (userId, message) => {
    try {
        let notifications = await Notify.findOne({ userId });

        if (!notifications) {
            notifications = new Notify({
                userId,
                messages: [{ notification: message, dateTime: new Date() }], // Push an object
                isViewed: true
            });

            await notifications.save();
        } else {
            notifications.messages.push({ notification: message, dateTime: new Date() });
            notifications.isViewed = true;
            await notifications.save();
        }

        console.log("Notification saved successfully!");
    } catch (error) {
        console.error("Error in userNotify:", error);
    }
};
