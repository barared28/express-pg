const Joi = require('joi');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/sql");

const generateToken = (val) => {
    const privateKey = process.env.JWT_PRIVATE_KEY;
    return jwt.sign(val, privateKey);
}

// @desc Register User
// @route POST api/v1/register
// @access ALL
exports.register = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(4).max(12).required(),
        password: Joi.string().min(8).max(12).required()
    })
    try {
        const { body } = req;
        await schema.validateAsync(body);
        const { name, email, password } = body;
        const check = await pool.query(`
            SELECT user_id FROM users WHERE email='${email}'
        `)
        if (check.rows.length > 0) {
            throw new Error('user email already exist');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const querySql = `
                INSERT INTO users (name, email, password)
                VALUES ('${name}', '${email}', '${hashedPassword}');
        `;
        await pool.query(querySql, (err) => {
            if (err) {
                res.status(400).send({
                    message: err.message,
                })
                return;
            }
        });

        const result = await pool.query(`
            SELECT user_id FROM users WHERE email='${email}'
        `);

        const token = generateToken(result.rows[0]);
        res.send({
            message: 'successfully register',
            token,
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// @desc Login
// @route POST api/v1/login
// @access ALL
exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(12).required()
    })
    try {
        const { body } = req;
        await schema.validateAsync(body);
        const { email, password } = body;
        const result = await pool.query(`
            SELECT user_id, password FROM users WHERE email='${email}'
        `);
        if (!result.rows || result.rows.length === 0) {
            throw new Error('user email didnt register');
        }
        const user = result.rows[0];
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            throw new Error('wrong password');
        }
        const token = generateToken({ user_id: user.user_id });
        res.send({
            message: 'successfully login',
            token,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// // @desc Get Posts
// // @route GET api/v1/posts
// // @access USER
// exports.getAll = async (req, res) => {
//     try {
//     } catch (error) {
//     }
// };