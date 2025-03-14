const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const EventRouter = express.Router();
const EventController = require("../controllers/EventCtrl");
const upload = require("../middlewares/upload");

// Add event (now uploads image to Cloudinary)
EventRouter.post("/api/v1/edit/addeve", isAuthenticated, upload.single("image"), EventController.add);

module.exports = EventRouter;
