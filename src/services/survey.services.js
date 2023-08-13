const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getWordCount = (str) => {
    return str.split(' ')
        .filter((n) => { return n != '' })
        .length;
};

const getTags = (str) => {
    return str.split(',')
        .map((n) => { return n.trim().toLowerCase() })

};


const getTitle = (str) => {
    const arr = str.split(" ");
    //loop through each element of the array and capitalize the first letter.

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    return arr.join(" ");
}

const isAuthorized = (req, res, next) => {
    const token = req.headers.token
    try {
        jwt.verify(token, process.env.jwt_secret);

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.decode(token);

    const userId = decodedToken.userid;
    return userId;
}

module.exports = {
    getWordCount,
    getTags,
    getTitle,
    isAuthorized,
    getUserIdFromToken
}