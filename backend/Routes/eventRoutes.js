const express = require("express");
const EventRouter = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const EventController = require("../controllers/EventCtrl");
const upload = require("../middlewares/upload");

EventRouter.post("/api/v1/events",isAuthenticated,upload.fields([{ name: "image", maxCount: 1 },{ name: "qrImage", maxCount: 1 },]),EventController.add);
EventRouter.get("/api/v1/events",EventController.fetch);
EventRouter.get("/api/v1/events/:eventid", EventController.fetchById);
EventRouter.patch( "/api/v1/events/:eventid",isAuthenticated,upload.fields([{ name: "image", maxCount: 1 },{ name: "qrImage", maxCount: 1 },]),EventController.update);
EventRouter.delete("/api/v1/events/:eventid",isAuthenticated,EventController.delete);

module.exports = EventRouter;
