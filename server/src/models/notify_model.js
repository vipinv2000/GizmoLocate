import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [{
        notification: {
            type: String,
            required: true
        },
        dateTime: {
            type: Date,
            default: Date.now
        },
        isorder: {
            type: Boolean,
            default: false
        }
    }],
    isViewed: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Notify = mongoose.model("Notify", notificationSchema);

export default Notify;
