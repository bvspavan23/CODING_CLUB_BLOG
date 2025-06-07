const Join = require("../model/Join");
const asyncHandler = require("express-async-handler");
const Question = require("../model/Question");
const joinRoom = {
  join: asyncHandler(async (req, res) => {
    try {
      const { name, quizCode } = req.body;
      if (!name || !quizCode) {
        return res
          .status(400)
          .json({ message: "Name and quizCode are required" });
      }
      const newJoin = new Join({ name, quizCode });
      await newJoin.save();
      return res
        .status(201)
        .json({ message: "Joined room successfully", joinData: newJoin });
    } catch (error) {
      console.error("Error joining room:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }),

  getjoinbyId: asyncHandler(async (req, res) => {
    try {
      const joinId = req.params.id;
      const joinEntry = await Join.findById(joinId);
      if (!joinEntry) {
        return res.status(404).json({ error: "Join entry not found." });
      }
      return res.status(200).json({ joinEntry });
    } catch (error) {
      console.error("Error getting join entry:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }),
submit: asyncHandler(async (req, res) => {
    try {
      const { joinId, answers } = req.body;
      const joinEntry = await Join.findById(joinId);
      
      if (!joinEntry) {
        return res.status(404).json({ error: "Join entry not found." });
      }

      // Initialize score and attemptedQuestions if they don't exist
      if (typeof joinEntry.score !== 'number') {
        joinEntry.score = 0;
      }
      if (!Array.isArray(joinEntry.attemptedQuestions)) {
        joinEntry.attemptedQuestions = [];
      }

      let currentScore = 0;
      const newAttemptedQuestions = [];

      for (const ans of answers) {
        // Check if this question was already attempted
        const existingAttemptIndex = joinEntry.attemptedQuestions.findIndex(
          q => q._id.toString() === ans.questionId
        );

        // If question was already attempted, skip to prevent duplicate scoring
        if (existingAttemptIndex !== -1) {
          continue;
        }

        const question = await Question.findById(ans.questionId);
        if (!question) continue;

        const isCorrect =
          Array.isArray(ans.chosenOptions) &&
          Array.isArray(question.correctAnswer) &&
          ans.chosenOptions.length === question.correctAnswer.length &&
          ans.chosenOptions.every((opt) =>
            question.correctAnswer.includes(opt)
          );
        
        const points = question.points;
        if (isCorrect) currentScore += points;

        newAttemptedQuestions.push({
          _id: ans.questionId,
          choosenOption: ans.chosenOptions,
          isCorrect,
          points: isCorrect ? points : 0,
          timestamp: new Date()
        });
      }

      // Update the join entry
      joinEntry.score += currentScore;
      joinEntry.attemptedQuestions = [...joinEntry.attemptedQuestions, ...newAttemptedQuestions];
      joinEntry.lastSubmittedAt = new Date();
      
      await joinEntry.save();
      
      res.status(200).json({ 
        message: "Quiz submitted", 
        currentScore,
        totalScore: joinEntry.score,
        attemptedQuestions: newAttemptedQuestions.length
      });
    } catch (error) {
      console.error("Submit Error:", error);
      res.status(500).json({ error: "Server error during submission." });
    }
  }),
  submitAll: asyncHandler(async (req, res) => {
    try {
      const { joinId, answers } = req.body;
      const joinEntry = await Join.findById(joinId);
      if (!joinEntry) {
        return res.status(404).json({ error: "Join entry not found." });
      }

      let score = 0;
      const attemptedQuestions = [];

      for (const ans of answers) {
        const question = await Question.findById(ans.questionId);

        if (!question) continue;

        const isCorrect =
          Array.isArray(ans.chosenOptions) &&
          Array.isArray(question.correctAnswer) &&
          ans.chosenOptions.length === question.correctAnswer.length &&
          ans.chosenOptions.every((opt) =>
            question.correctAnswer.includes(opt)
          );
          const points = question.points;
          // console.log(points);
          
        if (isCorrect) score += points;

        attemptedQuestions.push({
          _id: ans.questionId,
          choosenOption: ans.chosenOptions,
        });
      }
      joinEntry.score = score;
      joinEntry.attemptedQuestions = attemptedQuestions;
      joinEntry.isSubmitted = true;
      await joinEntry.save();
      res.status(200).json({ message: "Quiz submitted", score });
    } catch (error) {
      console.error("Submit Error:", error);
      res.status(500).json({ error: "Server error during submission." });
    }
  }),
  deleteall: asyncHandler(async (req, res) => {
    try {
      await Join.deleteMany({});
      res.status(200).json({ message: "All join entries deleted." });
    } catch (error) {
      console.error("Error deleting join entries:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }),
  getJoinByQuizId: asyncHandler(async (req, res) => {
    try {
      const { QuizId } = req.params;
      const joins = await Join.find({ quizCode: QuizId });
      res.status(200).json({ joins });
    } catch (error) {
      console.error("Error getting join entries:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }),
};

module.exports = joinRoom;
