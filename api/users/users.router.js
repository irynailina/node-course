const express = require("express");
const UserController = require("./users.controller");

const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);
userRouter.post(
  "/auth/register",
  UserController.validateCreateUser,
  UserController.createUser
);
userRouter.post(
  "/auth/login",
  UserController.validateLogin,
  UserController.login
);
userRouter.post(
  "/auth/logout",
  UserController.authorize,
  UserController.logout
);
userRouter.get(
  "/current",
  UserController.authorize,
  UserController.getCurrentUser
);

module.exports = userRouter;
