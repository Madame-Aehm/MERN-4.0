import express from "express";
import {
  testResponse,
  findAllUsers,
  findUserByEmail,
  createUser,
  updateUser,
  middleTest,
  findUserById,
  updatePassword,
  login,
} from "../controllers/user.js";
import { multerUpload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/testing", middleTest, testResponse);
userRouter.get("/all", findAllUsers);
userRouter.get("/email/:email", findUserByEmail);
userRouter.get("/_id/:_id", findUserById);

userRouter.post("/new", multerUpload.single("image"), createUser);
userRouter.post("/update", multerUpload.single("image"), updateUser);
userRouter.post("/updatePassword", updatePassword);
userRouter.post("/login", login);

export default userRouter;
