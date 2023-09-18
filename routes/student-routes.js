const express = require('express');

const {studentSearch, studentViewAdd, studentSave, studentViewEdit,
    studentUpdate, studentDelete}
    = require('../controllers/studentController')
const router = express.Router();

router.get('/students', studentSearch);
// Add new
router.get('/students/add', studentViewAdd);
router.post('/students/save', studentSave);
// Update
router.get('/students/edit/:id', studentViewEdit);
router.post('/students/update/:id', studentUpdate);

router.get('/students/delete/:id', studentDelete);

module.exports = {
    routes: router
}

