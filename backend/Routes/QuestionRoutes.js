const express = require("express");
const questionController = require("../controllers/QuestionCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const QuestionRouter = express.Router();

QuestionRouter.post("/api/v1/admin/:id/add-question", isAuthenticated,questionController.createOrUpdate);
QuestionRouter.get("/api/v1/admin/questions",isAuthenticated,questionController.getQuestions);
QuestionRouter.get("/api/v1/questions",questionController.getPublicQuestions);
QuestionRouter.get("/api/v1/admin/questions/:id",isAuthenticated,questionController.getQuestionById);
QuestionRouter.get("/api/v1/questions/:id",questionController.getPublicQuestionById);
QuestionRouter.delete("/api/v1/admin/delete-question/:id",isAuthenticated,questionController.deleteQuestion);
QuestionRouter.put("/api/v1/admin/update-question/:id",isAuthenticated,questionController.updateQuestion);

module.exports = QuestionRouter;