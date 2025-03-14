const express = require("express");
const EventRouter = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const EventController = require("../controllers/EventCtrl");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "events",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

EventRouter.put(
  "/api/v1/events/:eventname",
  isAuthenticated,
  upload.single("image"),
  EventController.update
);

module.exports = EventRouter;
