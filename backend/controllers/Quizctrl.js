const asyncHandler = require("express-async-handler");
const { nanoid } = require("nanoid");
const Quiz = require("../model/Quiz");
const Admin = require("../model/Admin");

const quizzes = {
  create: asyncHandler(async (req, res) => {
    const { name, startdate, enddate, starttime, endtime, maxpoints,isRealtime } = req.body;

    if (!name || !startdate || !enddate || !starttime || !endtime || !maxpoints) {
      throw new Error("Please provide all required fields");
    }

    const quizExists = await Quiz.findOne({ name });
    if (quizExists) {
      throw new Error("Quiz with this name already exists");
    }

    if (new Date(startdate) > new Date(enddate)) {
      throw new Error("End date must be after start date");
    }

    const quizcode = nanoid(6);

    const newQuiz = await Quiz.create({
      name,
      startdate,
      enddate,
      starttime,
      endtime,
      maxpoints,
      quizcode,
      isRealtime
    });

    const adminId = req.user;
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    admin.quizzes.push(newQuiz._id);
    await admin.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: {
        id: newQuiz._id,
        name: newQuiz.name,
        startdate: newQuiz.startdate,
        enddate: newQuiz.enddate,
        starttime: newQuiz.starttime,
        endtime: newQuiz.endtime,
        quizcode: newQuiz.quizcode,
        maxpoints: newQuiz.maxpoints,
        createdAt: newQuiz.createdAt,
        updatedAt: newQuiz.updatedAt
      }
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
    res.json({
      count: quizzes.length,
      quizzes: quizzes.map(quiz => ({
        id: quiz._id,
        name: quiz.name,
        startdate: quiz.startdate,
        enddate: quiz.enddate,
        starttime: quiz.starttime,
        endtime: quiz.endtime,
        quizcode: quiz.quizcode,
        maxpoints: quiz.maxpoints,
        questions: quiz.questions,
        isRealtime: quiz.isRealtime,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt
      }))
    });
  }),

  getQuizById: asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    res.json({
      id: quiz._id,
      name: quiz.name,
      startdate: quiz.startdate,
      enddate: quiz.enddate,
      starttime: quiz.starttime,
      endtime: quiz.endtime,
      quizcode: quiz.quizcode,
      maxpoints: quiz.maxpoints,
      isRealtime: quiz.isRealtime,
      questions: quiz.questions,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    });
  }),

  updateQuiz: asyncHandler(async (req, res) => {
    const { name, startdate, enddate, starttime, endtime, maxpoints, isRealtime } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    if (name && name !== quiz.name) {
      const nameExists = await Quiz.findOne({ name });
      if (nameExists) {
        throw new Error("Quiz with this name already exists");
      }
    }
    if (startdate || enddate) {
      const newStartDate = startdate ? new Date(startdate) : quiz.startdate;
      const newEndDate = enddate ? new Date(enddate) : quiz.enddate;
      if (newStartDate > newEndDate) {
        throw new Error("End date must be after start date");
      }
    }
    quiz.name = name || quiz.name;
    quiz.startdate = startdate || quiz.startdate;
    quiz.enddate = enddate || quiz.enddate;
    quiz.starttime = starttime || quiz.starttime;
    quiz.endtime = endtime || quiz.endtime;
    quiz.maxpoints = maxpoints || quiz.maxpoints;
    quiz.isRealtime = isRealtime || quiz.isRealtime;
    const updatedQuiz = await quiz.save();
    res.json({
      message: "Quiz updated successfully",
      quiz: {
        id: updatedQuiz._id,
        name: updatedQuiz.name,
        startdate: updatedQuiz.startdate,
        enddate: updatedQuiz.enddate,
        starttime: updatedQuiz.starttime,
        endtime: updatedQuiz.endtime,
        quizcode: updatedQuiz.quizcode,
        maxpoints: updatedQuiz.maxpoints,
        isRealtime: updatedQuiz.isRealtime,
        createdAt: updatedQuiz.createdAt,
        updatedAt: updatedQuiz.updatedAt
      }
    });
  }),

  deleteQuiz: asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    await Admin.updateMany({ quizzes: quiz._id }, { $pull: { quizzes: quiz._id } });
    await quiz.deleteOne();

    res.json({
      message: "Quiz deleted successfully",
      id: quiz._id,
      name: quiz.name
    });
  })
};

module.exports = quizzes;
