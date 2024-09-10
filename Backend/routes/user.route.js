import express from "express";
import multer from "multer";
import {
  allUsers,
  login,
  logout,
  signup,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Signup route with file upload middleware
router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);

export default router;
