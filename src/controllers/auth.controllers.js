const handleErrors = require('../services/auth.services');
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//controller for sign up route
module.exports.signup = async(req, res) => {
    try {

        const { firstname, lastname, email, password } = req.body;

        const user = await UserModel.create({ firstname, lastname, email, password });
        if (user) {
            return res.status(201).json({ message: "Successfully created user", user: user });
        }

        return res.status(400).json({ message: "Something went wrong" });


    } catch (error) {
        const errors = handleErrors(error);
        return res.status(409).json(errors);

    }

};



module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        let token;

        //validate user data
        if (!email || !password) {
            return res.status(400).json({ message: "Incomplete Input" });
        }

        const user = await UserModel.findOne({ email: email });


        if (!user) {
            return res.status(400).json({ message: "Wrong email" });
        }

        if (user && await (bcrypt.compare(password, user.password))) {
            token = await jwt.sign({
                    userid: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                },
                process.env.jwt_secret, { expiresIn: process.env.expiry });


        }

        return res.status(200).json({ token: token });



    } catch (error) {
        return res.status(409).json({ message: "An error occurred" + error.message });
        console.log(error);
    }

};