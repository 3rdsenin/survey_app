const router = require('express').Router();
const surveyController = require('../controllers/survey.controllers');
const { isAuthorized } = require('../services/survey.services')


//create post
router.post('/create', isAuthorized, surveyController.createSurvey);

//get particular post by id
router.get('/published_survey/:id', surveyController.getPublishedSurvey);

//get published posts
router.get('/published_surveys', surveyController.getPublishedSurveys)

//update particular post state
router.patch('/updateSurveyState', isAuthorized, surveyController.updateSurveyState);

//update particular post
router.patch('/editSurvey/:id', isAuthorized, surveyController.updateSurvey);

//delete particular post
router.delete('/deleteSurvey/:id', isAuthorized, surveyController.deleteSurvey);

//get particular user's posts
router.get('/userSurveys', isAuthorized, surveyController.getUserSurveys);


module.exports = router;