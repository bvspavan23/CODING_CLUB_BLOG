const express = require("express");
const EventRouter = express.Router();
const EventController = require("../controllers/EventCtrl");
//fetch event
EventRouter.get("/api/v1/events", EventController.fetch);
module.exports = EventRouter;

