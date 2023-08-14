const surveyModel = require('../models/survey.model');
const UserModel = require('../models/user.model');
const questionModel = require('../models/question.model');
const responseModel = require('../models/responses.model');
const moment = require('moment');
const { getUserIdFromToken } = require('../services/survey.services')

const getReponses = async(questionId) => {
    return await responseModel.find({ questionId })
}

//create survey
module.exports.createSurvey = async(req, res) => {
    try {
        const { title, description } = req.body;

        const payload = {
                timestamp: moment().toDate(),
                title: title.toLowerCase(),
                description,
                author: getUserIdFromToken(req.headers.token),
                state: 'draft'

            }
            // //validation of content


        if (!title) {
            return res.status(409).json({ message: "Please enter a title" });
        }

        const survey = await surveyModel.create(payload);
        if (survey) {
            return res.status(200).json({ message: "successfully posted", survey: survey })
        }

        return res.status(500).json({ message: "We encountered a problem creating the survey, please try again" });
    } catch (error) {
        return res.status(409).json({ message: "An error occurred: " + error.message });

    }

};
//get all published surveys
module.exports.getPublishedSurveys = async(req, res) => {

    const { page, posts, author, title, order_by, order } = req.query;
    const searchQuery = { state: 'published' },
        sortQuery = {};


    //Pagination
    const startpage = (!page ? 0 : page);
    const postsPerPage = (!posts ? 20 : posts);
    const sortOrder = (!order ? "asc" : order);
    const orderParams = (!order_by ? "timestamp" : order_by);
    //Searching
    if (author) {
        searchQuery.author = author;

    }

    if (title) {
        searchQuery.title = title.toLowerCase();
    }

    //Sorting

    sortParams = orderParams.split(",");
    for (const param of sortParams) {

        if (sortOrder == "asc" && order_by) {
            sortQuery[param] = 1;
        }
        if (sortOrder == "desc" && order_by) {
            sortQuery[param] = -1;
        }
        if (sortOrder == "desc" && !order_by) {
            sortQuery[param] = -1;
        }
        if (sortOrder == "asc" && !order_by) {
            sortQuery[param] = 1;
        }

    }



    const survey = await surveyModel
        .find({...searchQuery })
        .sort(sortQuery)
        .skip(startpage)
        .limit(postsPerPage);


    if (!survey) {
        res.status(401).json({ message: "Sorry , there are currently no published surveys" });
        res.end();
    }
    if (survey.length === 0) {
        res.status(409).json({ message: "Sorry , there are currently no published surveys that match your search criteria" });
        res.end();
    } else {
        return res.status(200).json({ survey });
    }

};
//get published survey by id:
module.exports.getPublishedSurvey = async(req, res) => {
    try {
        const { id } = req.params;
        const survey = await surveyModel.findById(id);

        if (!survey) {
            return res.status(404).json({ message: "Sorry , this survey was not found." });
        }
        const user = await UserModel.findById(survey.author);
        // survey.read_count++;
        //await survey.save()
        let author = {
            authorid: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        }
        return res.status(200).json({ survey, author });
    } catch (err) {
        return res.status(404).json({ message: "Please check survey id and try again" });
    }
};
//update a survey state
module.exports.updateSurveyState = async(req, res) => {
    const { id, state } = req.query;
    const userId = getUserIdFromToken(req.headers.token);
    const survey = await surveyModel.findById(id);
    if (!survey) {
        return res.status(404).json({ status: false, message: "Survey does not exist" })
    }
    if (survey.author === userId) {
        survey.state = state;
        await survey.save();
        return res.status(200).json({ message: `Survey state update successfully to ${state}`, survey: survey });
    }

    return res.status(403).json({ message: "Unauthorized to update this survey" });





};
//update/edit a survey
module.exports.updateSurvey = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;


        if (!title) {
            return res.status(409).json({ message: "Please enter a title" });
        }
        if (!description) {
            return res.status(409).json({ message: "Please enter a description" });
        }

        const userId = getUserIdFromToken(req.headers.token);
        const survey = await surveyModel.findById(id);
        if (!survey) {
            return res.status(404).json({ status: unsuccessful, message: "Survey does not exist" })
        }

        if (survey.author === userId) {
            survey.title = title;
            survey.description = description;
            await survey.save();
            return res.status(200).json({ message: "updated successfully", survey: survey });
        }

        return res.status(403).json({ message: "Unauthorized to update this survey" });

    } catch (err) {
        return res.status(403).json({ message: err });
    }



};
//delete a survey
module.exports.deleteSurvey = async(req, res) => {
    const { id } = req.params;
    const userId = getUserIdFromToken(req.headers.token);
    const survey = await surveyModel.findById(id);



    if (!survey) {
        return res.status(404).json({ status: false, message: "Survey does not exist" })
    }

    if (survey.author === userId) {

        const result = await surveyModel.deleteOne({ _id: id })
        if (result) {
            return res.json({ status: true, message: "Survey deleted successfully" })
        } else {
            return res.json({ status: false, message: "Something went wrong, please try again later" })
        }

    } else {
        return res.json({ status: false, message: "You are not authorized to perform this action" })
    }

};

//get a user's surveys
module.exports.getUserSurveys = async(req, res) => {
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

    const survey = await surveyModel.find(searchQuery)
        .sort(sortOrder)
        .skip(startpage)
        .limit(postsPerPage);
    if (!survey) {
        return res.status(404).json({ status: false, message: "This user does not have any surveys" })
    }
    if (survey.length == 0) {
        return res.status(404).json({ status: false, message: "This user does not have any surveys that match search criteria" })
    }

    return res.status(200).json({ survey: survey });
};

//serve a survey:
module.exports.serveSurvey = async(req, res) => {
    try {
        let responseObject = [];
        const { id } = req.params;
        const survey = await surveyModel.findById(id);

        if (!survey) {
            return res.status(404).json({ message: "Sorry , this survey was not found." });
        }
        const user = await UserModel.findById(survey.author);
        const surveyQuestions = await questionModel.find({ surveyId: survey._id });

        surveyQuestions.forEach(surveyQuestion => {
            let questionId = surveyQuestion._id;
            let question = surveyQuestion.content;
            let type = surveyQuestion.type;
            let response = [];

            let questionObj = { questionId, question, type, response }

            responseObject.push(questionObj);
        })

        return res.status(200).json({ "Survey Title": survey.title, "Survey Description": survey.description, "Created by": user.firstname + ' ' + user.lastname, "Questions": responseObject });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

//serve a survey:
module.exports.receiveSurveyResponse = async(req, res) => {

    let body = req.body;
    let responses = body.response
    let mydata = [];
    if (!responses) {
        return res.status(404).json({ message: "No response recieved, please follow response format" });
    }
    try {
        responses.forEach(async(response) => {

            const payload = {
                timestamp: moment().toDate(),
                questionId: response.questionId,
                response: response.response
            }
            mydata.push(payload);
        })

        responseModel.insertMany(mydata).then(function(docs) {
            return res.status(200).json({ message: "Response recorded" });
        }).catch(function(error) {
            return res.status(404).json({ message: error.message });
        })

    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

//serve a surveywith responses
module.exports.getSurveyAndResponses = async(req, res) => {
    try {
        let responseObject = [];
        const { id } = req.params;
        const survey = await surveyModel.findById(id);

        if (!survey) {
            return res.status(404).json({ message: "Sorry , this survey was not found." });
        }
        const user = await UserModel.findById(survey.author);
        const surveyQuestions = await questionModel.find({ surveyId: survey._id });
        for (const surveyQuestion of surveyQuestions) {
            let questionId = surveyQuestion._id;
            let question = surveyQuestion.content;
            let type = surveyQuestion.type;
            let responses = await getReponses(questionId);

            let questionObj = { questionId, question, type, responses };

            responseObject.push(questionObj);
        }

        return res.status(200).json({ "Survey Title": survey.title, "Survey Description": survey.description, "Created by": user.firstname + ' ' + user.lastname, "Questions": responseObject });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};