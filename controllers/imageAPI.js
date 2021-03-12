const cloudinary = require('cloudinary');
const multipartMiddleware = multipart();
const multipart = require('connect-multipart');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const db = require('../models')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const multer = require('multer');
const router = require('../routes/example');


router.post('/', multipartMiddleware, (req, res) => {
    console.log('=====> Inside testing image');
    console.log('=====> req.file');
    console.log(req.file.path);
    let body = req.body;

    cloudinary.uploader.upload(req.file.path, function(result) {
        console.log('this is from cloudinary', result);
        res.json({ url: result.secure_url })
    })
});


module.exports = {
    router,
}