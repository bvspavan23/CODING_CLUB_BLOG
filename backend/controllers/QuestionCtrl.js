const asyncHandler = require("express-async-handler");
const Question = require("../model/Question");
const Quiz = require("../model/Quiz");

const questions = {
  // Create or replace all questions for a quiz
  createOrUpdate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = Array.isArray(req.body) ? req.body : [req.body];
    
    // Check if quiz exists
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    
    // Validate all questions first
    const validatedQuestions = [];
    for (const item of data) {
      const { question, points, options, correctAnswer } = item;
      
      if (!question || !points || !options || !correctAnswer) {
        throw new Error("Missing required fields in one or more questions");
      }
      
      if (question.replace(/<[^>]*>/g, '').trim() === '') {
        throw new Error("Question text cannot be empty");
      }
      
      const nonEmptyOptions = options.filter(opt => 
        opt.replace(/<[^>]*>/g, '').trim() !== ''
      );
      
      if (nonEmptyOptions.length < 2) {
        throw new Error("At least two non-empty options are required");
      }
      
      const correctAnswers = correctAnswer.map(index => Number(index));
      if (correctAnswers.length < 1 || correctAnswers.some(index => index >= nonEmptyOptions.length || index < 0)) {
        throw new Error("Invalid correct answer indices");
      }
      
      validatedQuestions.push({
        quiz: id,
        question,
        points: Number(points) || 1,
        options: nonEmptyOptions,
        correctAnswer: correctAnswers
      });
    }
    
    // Delete existing questions for this quiz
    await Question.deleteMany({ quiz: id });
    
    // Create new questions
    const createdQuestions = await Question.insertMany(validatedQuestions);
    
    // Update quiz with new question references
    quiz.questions = createdQuestions.map(q => q._id);
    await quiz.save();
    
    res.status(201).json({
      message: `${createdQuestions.length} question(s) created/updated successfully`,
      questions: createdQuestions.map(q => ({
        id: q._id,
        quiz: q.quiz,
        question: q.question,
        points: q.points,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });
  }),

  // Get all questions for a specific quiz
  getQuestions: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if quiz exists
    const quiz = await Quiz.findById(id).populate('questions');
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    
    res.json({
      count: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        id: q._id,
        question: q.question,
        points: q.points,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });
  }),

  getPublicQuestions: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate('questions');
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    res.json({
      count: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        id: q._id,
        question: q.question,
        points: q.points,
        options: q.options,
      }))
    });
  }),
  
  getQuestionById: asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      throw new Error("Question not found");
    }
    
    res.json({
      id: question._id,
      quiz: question.quiz,
      question: question.question,
      points: question.points,
      options: question.options,
      correctAnswer: question.correctAnswer
    });
  }),
  
  getPublicQuestionById: asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
      throw new Error("Question not found");
    }
    res.json({
      id: question._id,
      quiz: question.quiz,
      question: question.question,
      points: question.points,
      options: question.options,
    });
  }),
  
  // Update a question
  updateQuestion: asyncHandler(async (req, res) => {
  const { question, points, options, correctAnswer } = req.body;
  
  const existingQuestion = await Question.findById(req.params.id);
  if (!existingQuestion) {
    throw new Error("Question not found");
  }
  
  // Validate question text if provided
  if (question && question.replace(/<[^>]*>/g, '').trim() === '') {
    throw new Error("Question text cannot be empty");
  }
  
  // Filter out empty options if options are being updated
  let nonEmptyOptions = existingQuestion.options;
  if (options) {
    nonEmptyOptions = options.filter(opt => opt.replace(/<[^>]*>/g, '').trim() !== '');
    if (nonEmptyOptions.length < 2) {
      throw new Error("At least two non-empty options are required");
    }
  }
  
  // Process correct answers
  let correctAnswers = existingQuestion.correctAnswer;
  if (correctAnswer) {
    correctAnswers = correctAnswer.map(index => Number(index));
    if (correctAnswers.length < 1) {
      throw new Error("At least one correct answer is required");
    }
    
    if (correctAnswers.some(index => index >= nonEmptyOptions.length || index < 0)) {
      throw new Error("Correct answer indices are invalid");
    }
  }
  
  // Update fields
  existingQuestion.question = question || existingQuestion.question;
  existingQuestion.points = points ? Number(points) : existingQuestion.points;
  existingQuestion.options = options ? nonEmptyOptions : existingQuestion.options;
  existingQuestion.correctAnswer = correctAnswer ? correctAnswers : existingQuestion.correctAnswer;
  
  const updatedQuestion = await existingQuestion.save();
  
  res.json({
    message: "Question updated successfully",
    question: {
      id: updatedQuestion._id,
      quiz: updatedQuestion.quiz,
      question: updatedQuestion.question,
      points: updatedQuestion.points,
      options: updatedQuestion.options,
      correctAnswer: updatedQuestion.correctAnswer
    }
  });
}),
  
  // Delete a question
  deleteQuestion: asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      throw new Error("Question not found");
    }
    
    await question.deleteOne();
    
    res.json({
      message: "Question deleted successfully",
      id: question._id,
      questionText: question.question
    });
  })
};

module.exports = questions;