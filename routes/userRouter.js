import express from "express";
import { getUser, createUser, loginUser, googleCreateUser, googleLoginUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleCreateUser);
userRouter.post("/googleLogin", googleLoginUser);

export default userRouter;