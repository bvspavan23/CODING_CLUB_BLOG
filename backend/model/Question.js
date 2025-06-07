const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: [Number],
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);
