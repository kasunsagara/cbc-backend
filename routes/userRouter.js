import express from "express";
import { getUser,getUsers, createUser, loginUser, googleCreateUser, googleLoginUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/every", getUsers);
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleCreateUser);
userRouter.post("/googleLogin", googleLoginUser);
userRouter.delete("/:email", deleteUser);

export default userRouter;