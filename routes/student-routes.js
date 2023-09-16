const express = require('express');

const {studentView} = require('../controllers/studentControler')
const router = express.Router();

router.get('/students', studentView);

module.exports = {
    routes: router
}

