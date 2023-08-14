const router = require('express').Router();
const questionController = require('../controllers/question.controllers');
const { isAuthorized } = require('../services/survey.services')


//create question
router.post('/create', isAuthorized, questionController.createQuestion);

// //update/edit particular question 
router.patch('/editQuestion/:id', isAuthorized, questionController.updateQuestion);

//delete particular question
router.delete('/deleteQuestion/:id', isAuthorized, questionController.deleteQuestion);

//get questions
router.get('/survey/:id', questionController.getSurveyQuestions);




module.exports = router;