const express = require('express');
const cookieParser = require('cookie-parser');
const authrouter = require("./src/routes/auth.routes");
const blogrouter = require("./src/routes/blog.routes");
const homerouter = require("./src/routes/home.routes");


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authrouter);
app.use('/blog', blogrouter);
app.use('/', homerouter);








module.exports = app;