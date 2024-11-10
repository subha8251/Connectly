import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import cloudinary from 'cloudinary';
import multer from 'multer';

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'dlrjqxzhs',
  api_key: '796379156913999',
  api_secret: '3tSdLsV-Leb08a19T5LzEnFbXvc',
});

export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  const image = req.file; // Multer stores the file in req.file
  //console.log("aa"+image);

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary
    let imageUrl = '';
    if (image) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: 'user_images' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(image.buffer);
      });

      imageUrl = result.secure_url;
    }
    else{
      imageUrl = "https://res.cloudinary.com/dlrjqxzhs/image/upload/v1725959461/user_images/s6modaxdti3hluem8bvy.jpg"
    }
   
    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
      imageurl: imageUrl,
    });
    console.log(newUser);
    await newUser.save();

    createTokenAndSaveCookie(newUser._id, res);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ error: "Invalid user credential" });
    }
    createTokenAndSaveCookie(user._id, res);
    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(201).json(filteredUsers);
  } catch (error) {
    console.log("Error in allUsers Controller: " + error);
  }
};
