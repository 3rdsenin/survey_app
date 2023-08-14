const router = require('express').Router();
const surveyController = require('../controllers/survey.controllers');
const { isAuthorized } = require('../services/survey.services')


//create survey
router.post('/create', isAuthorized, surveyController.createSurvey);

//get particular survey by id
router.get('/published_survey/:id', surveyController.getPublishedSurvey);

//get published surveys
router.get('/published_surveys', surveyController.getPublishedSurveys)

//update particular survey state
router.patch('/updateSurveyState', isAuthorized, surveyController.updateSurveyState);

//update particular survey
router.patch('/editSurvey/:id', isAuthorized, surveyController.updateSurvey);

//delete particular survey
router.delete('/deleteSurvey/:id', isAuthorized, surveyController.deleteSurvey);

//get particular user's surveys
router.get('/userSurveys', isAuthorized, surveyController.getUserSurveys);

//get particular user's surveys
router.get('/serveSurvey/:id', surveyController.serveSurvey);

//receive survey response
router.post('/receiveSurveyResponse', surveyController.receiveSurveyResponse);

//get survey and responses
router.get('/serveSurveyandResponses/:id', isAuthorized, surveyController.getSurveyAndResponses);

module.exports = router;