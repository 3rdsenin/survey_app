const express = require('express');
const cookieParser = require('cookie-parser');
const authrouter = require("./src/routes/auth.routes");
const surveyrouter = require("./src/routes/survey.routes");
const questionrouter = require("./src/routes/question.routes");
const homerouter = require("./src/routes/home.routes");


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authrouter);
app.use('/survey', surveyrouter);
app.use('/question', questionrouter);
app.use('/', homerouter);








module.exports = app;