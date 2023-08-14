const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ResponseSchema = new Schema({
    id: ObjectId,
    timestamp: { type: Date },
    questionId: { type: String, required: [true, ''] },
    response: [],



});

const Response = mongoose.model('Response', ResponseSchema);
module.exports = Response;