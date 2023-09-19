const express = require('express');

const {lecturerSearch, lecturerViewAdd, lecturerSave, lecturerViewEdit,
    lecturerUpdate, lecturerDelete}
    = require('../controllers/lecturerController')
const router = express.Router();

router.get('/lecturers', lecturerSearch);
// Add new
router.get('/lecturers/add', lecturerViewAdd);
router.post('/lecturers/save', lecturerSave);
// Update
router.get('/lecturers/edit/:id', lecturerViewEdit);
router.post('/lecturers/update/:id', lecturerUpdate);

router.get('/lecturers/delete/:id', lecturerDelete);


module.exports = {
    routes: router
}

