const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const QuestionSchema = new Schema({
    id: ObjectId,
    timestamp: { type: Date },
    content: { type: String, lowercase: true, required: [true, 'Question must have content'] },
    author: { type: String, required: [true, 'Question must have a author'] },
    surveyId: { type: String, required: [true, 'Question belong to a survey'] },
    type: { type: String, enum: ['text', 'single choice', 'multiple choice', 'number'] },
    isRequired: { type: String, enum: ['yes', 'no'], required: [true, 'Question must either be required or not required'] }



});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;