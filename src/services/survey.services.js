const jwt = require('jsonwebtoken');


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
    isAuthorized,
    getUserIdFromToken
}