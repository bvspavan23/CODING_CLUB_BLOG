const express = require("express");
const eveRegs = require("../controllers/eveRegistrationCtrl");
const eveRegRouter = express.Router();
// !Register
eveRegRouter.post("/api/v1/student/reg", eveRegs.register);

module.exports = eveRegRouter;