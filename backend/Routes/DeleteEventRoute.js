const express = require("express");
const EventRouter = express.Router();
const EventController = require("../controllers/EventCtrl");
//delete event
EventRouter.delete("/api/v1/events/:eventid", EventController.delete);
module.exports = EventRouter;

