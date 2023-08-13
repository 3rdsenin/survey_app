const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SurveySchema = new Schema({
    id: ObjectId,
    timestamp: { type: Date },
    title: { type: String, lowercase: true, required: [true, 'Survey must have a title'] },
    description: { type: String },
    submit_count: { type: Number },
    author: { type: String, required: [true, 'Survey must have a author'] },
    state: { type: String, enum: ['draft', 'published'], default: 'draft' }


});

const Survey = mongoose.model('Survey', SurveySchema);
module.exports = Survey;