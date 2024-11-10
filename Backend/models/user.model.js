import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
    },
    imageurl:{
        type: String,
        default: 'https://res.cloudinary.com/dlrjqxzhs/image/upload/v1725959461/user_images/s6modaxdti3hluem8bvy.jpg'
    }
}, { timestamps: true }); // createdAt & updatedAt

const User = mongoose.model("User", userSchema);
export default User;