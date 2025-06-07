const express = require("express");
const quizController = require("../controllers/Quizctrl");
const isAuthenticated = require("../middlewares/isAuth");
const QuizRouter = express.Router();

QuizRouter.post("/api/v1/admin/create-quiz",isAuthenticated, quizController.create);

QuizRouter.get("/api/v1/admin/quizes",quizController.getAll);

QuizRouter.get("/api/v1/admin/quizes/:id",quizController.getQuizById);

QuizRouter.delete("/api/v1/admin/delete-quiz/:id",isAuthenticated,quizController.deleteQuiz);

QuizRouter.put("/api/v1/admin/update-quiz/:id",isAuthenticated,quizController.updateQuiz);

module.exports = QuizRouter;