const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPostSchema = new Schema({
    id: ObjectId,
    timestamp: { type: Date },
    title: { type: String, lowercase: true, required: [true, 'Blog must have a title'] },
    description: { type: String },
    tags: [],
    author: { type: String, required: [true, 'Blog must have a author'] },
    read_count: { type: Number },
    read_time: { type: Number },
    body: { type: String, required: [true, 'Blog must have a body'] },
    state: { type: String, enum: ['draft', 'published'], default: 'draft' },


});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;