const express = require("express");
const UserController = require("./users.controller");
const multer = require("multer");
const userRouter = express.Router();
const path = require("path");
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const storage = multer.diskStorage({
  destination: process.env.STATIC_BASE_PATH,
  filename: (req, file, callback) => {
    const { ext } = path.parse(file.originalname);
    return callback(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

async function compressImage(req, res, next) {
  const { path: filePath, destination: multerDest, filename } = req.file;
  const DESTINATION_PATH = "./public/images";
  const files = await imagemin([`${multerDest}/${filename}`], {
    destination: "./public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  await fsPromises.unlink(filePath);

  req.file.destination = DESTINATION_PATH;
  req.file.path = path.join(DESTINATION_PATH, filename);

  next();
}

userRouter.patch(
  "/avatars",
  upload.single("avatar"),
  compressImage,
  (req, res, next) => {
    if (req.file) {
      return res.status(200).send("hello");
    } else {
      return res.status(401).send("Not authorized");
    }
  }
);

userRouter.get("/", UserController.getUsers);
userRouter.get("/auth/verify/:verificationToken", UserController.verifyUser);
userRouter.post(
  "/auth/register",
  upload.single("avatar"),
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
