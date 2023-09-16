const express = require('express');

const {indexView, studentView} = require('../controllers/homeController')
const router = express.Router();

router.get('/', indexView);


module.exports = {
    routes: router
}
