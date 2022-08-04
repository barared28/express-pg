const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    try {
        const header = req.header("Authorization");
        if (!header) {
            res.status(400).send({
                message: 'invalid token'
            });
        }
        const token = header.replace("Bearer ", "");
        const privateKey = process.env.JWT_PRIVATE_KEY;
        const user = jwt.verify(token, privateKey);
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({
            message: error.message,
        })
    }
};