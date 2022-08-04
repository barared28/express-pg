const { pool } = require('../config/sql');
const Joi = require("joi");

// @desc Get Images
// @route GET api/v1/my-images
// @access USER
exports.getMyImages = async (req, res) => {
    try {
        const { user } = req;
        const result = await pool.query(`
            SELECT image_id as id, image FROM images
            WHERE user_id='${user.user_id}'
        `);
        res.send({
            data: result.rows,
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// @desc Post Image
// @route POST api/v1/store-image
// @access USER
exports.storeImage = async (req, res) => {
    const schema = Joi.object({
        image_url: Joi.string().max(300).required()
    })
    try {
        const { body, user } = req;
        await schema.validateAsync(body);
        const { image_url: imgUrl } = body;
        await pool.query(`
            INSERT INTO images (user_id, image)
            VALUES ('${user.user_id}', '${imgUrl}');
        `);
        res.send({
            message: 'upload successfully'
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// @desc Delete Image
// @route DELETE api/v1/delete-image/:id
// @access USER
exports.deleteImage = async (req, res) => {
    try {
        const { params: { id }, user: { user_id: userId } } = req;
        const image = await pool.query(`
            SELECT user_id FROM images
            WHERE image_id='${id}';
        `);
        if (!image.rows ||image.rows.length === 0) {
            throw new Error('image didnt exist');
        }
        if (image.rows[0].user_id !== Number(userId)) {
            throw new Error('didnt have access');
        }
        await pool.query(`
            DELETE FROM images
            WHERE image_id='${id}';
        `);
        res.send({
            message: 'successfully delete image'
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// @desc Get Images by user_io
// @route GET api/v1/user-images/:id
// @access USER
exports.getImagesByUserId = async (req, res) => {
    const schema = Joi.object({
        id: Joi.number().required()
    })
    try {
        const { params: { id } } = req;
        await schema.validateAsync({ id });
        const images = await pool.query(`
            SELECT image FROM images
            WHERE user_id='${id}';
        `);
       res.send({
           message: 'successfully fetch images',
           data: images.rows || [],
       })
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

// @desc Get Images by image_id
// @route GET api/v1/image/:id
// @access USER
exports.getImagesByImageId = async (req, res) => {
    const schema = Joi.object({
        id: Joi.number().required()
    })
    try {
        const { params: { id } } = req;
        await schema.validateAsync({ id });
        const images = await pool.query(`
            SELECT image FROM images
            WHERE image_id='${id}';
        `);
        if (!images.rows[0]) {
            throw new Error('image didnt exist')
        }
        res.send({
            message: 'successfully fetch image',
            data: images.rows[0],
        })
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