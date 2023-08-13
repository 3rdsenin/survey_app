const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ResponseSchema = new Schema({
    id: ObjectId,
    timestamp: { type: Date },
    question: { type: String, required: [true, ''] },
    response: [],
    author: { type: String, required: [true, 'Response must have a author'] }


});

const Response = mongoose.model('BlogPost', ResponseSchema);
module.exports = Response;