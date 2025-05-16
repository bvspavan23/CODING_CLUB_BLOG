const express = require("express");
const buzzController=require("../controllers/buzzerCtrl");
const buzzRouter = express.Router();

buzzRouter.post("/api/v1/create-buzz",buzzController.create);
buzzRouter.get("/api/v1/buzzes",buzzController.getAll);
buzzRouter.delete("/api/v1/buzzes/delete/:roomId", buzzController.deleteBuzz);
module.exports = buzzRouter;