const router = require('express').Router();
const questionModel = require('../models/question.model');
const UserModel = require('../models/user.model');
const moment = require('moment');
const { getWordCount, getTags, getUserIdFromToken } = require('../services/blog.services')



//create question
module.exports.createQuestion = async(req, res) => {
    try {
        const { content, surveyId, type, isrequired } = req.body;

        const payload = {
                timestamp: moment().toDate(),
                content,
                author: getUserIdFromToken(req.headers.token),
                surveyId,
                type,
                isRequired: isrequired.toLowerCase()

            }
            // //validation of content


        if (!content) {
            return res.status(409).json({ message: "Question can not be empty" });
        }

        if (!type) {
            return res.status(409).json({ message: "Question must have a type" });
        }

        if (!isrequired) {
            return res.status(409).json({ message: "Please specify is question is required" });
        }
        if (!surveyId) {
            return res.status(409).json({ message: "Question must belong to a survey" });
        }

        const question = await questionModel.create(payload);
        if (question) {
            return res.status(200).json({ message: "successfully created", question: question })
        }

        return res.status(500).json({ message: "We encountered a problem creating the question, please try again" });
    } catch (error) {
        return res.status(409).json({ message: "An error occurred: " + error.message });

    }

};
//get all questions for survey by id
module.exports.getSurveyQuestions = async(req, res) => {
    const { id } = req.params;
    const questions = await questionModel.find({ surveyId: id })



    if (!questions) {
        res.status(401).json({ message: "Sorry , there are currently no questions for that survey" });
        res.end();
    } else {
        return res.status(200).json({ questions });
    }

};


//update a question
module.exports.updateQuestion = async(req, res) => {
    try {
        const { id } = req.params;
        const { content, type, isrequired } = req.body;
        const author = await getUserIdFromToken(req.headers.token);

        if (!content) {
            return res.status(409).json({ message: "Question can not be empty" });
        }

        if (!type) {
            return res.status(409).json({ message: "Question must have a type" });
        }

        if (!isrequired) {
            return res.status(409).json({ message: "Please specify is question is required" });
        }

        const question = await questionModel.findById(id);
        if (!question) {
            return res.status(404).json({ status: false, message: "Question does not exist" })
        }

        if (question.author === author) {
            question.content = content;
            question.type = type.toLowerCase();
            question.isRequired = isrequired;

            await question.save();
            return res.status(200).json({ message: "Question updated successfully", question: question });
        }

        return res.status(403).json({ message: "Unauthorized to update this question" });

    } catch (err) {
        return res.status(403).json({ message: err });
    }



};
//delete a question
module.exports.deleteQuestion = async(req, res) => {
    const { id } = req.params;
    const userId = getUserIdFromToken(req.headers.token);
    const question = await questionModel.findById(id);



    if (!question) {
        return res.status(404).json({ status: false, message: "Question does not exist" })
    }

    if (question.author === userId) {

        const post = await questionModel.deleteOne({ _id: id })
        if (post) {
            return res.json({ status: true, message: "Question deleted successfully" })
        } else {
            return res.json({ status: false, message: "Something went wrong, please try again later" })
        }

    } else {
        return res.json({ status: false, message: "Unauthorized to perform operation" })
    }

};

module.exports.getUserPosts = async(req, res) => {
    const {
        page,
        posts,
        state,
        order
    } = req.query;
    const searchQuery = {};

    //Pagination
    const startpage = (!page ? 0 : page);
    const postsPerPage = (!posts ? 10 : posts);
    const sortOrder = (!order ? "asc" : order);
    const stateParam = (!state ? "draft" : state);

    //Searching
    searchQuery.author = getUserIdFromToken(req.headers.token);
    searchQuery.state = stateParam;


    //Sorting

    const blog = await BlogModel.find(searchQuery)
        .sort(sortOrder)
        .skip(startpage)
        .limit(postsPerPage);
    if (!blog) {
        return res.status(404).json({ status: false, message: "This user does not have any posts" })
    }

    return res.status(200).json({ blog: blog });
};