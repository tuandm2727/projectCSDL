const express = require('express');

const {subjectSearch, subjectViewAdd, subjectSave, subjectViewEdit,
    subjectUpdate, subjectDelete}
    = require('../controllers/subjectController')
const router = express.Router();

router.get('/subjects', subjectSearch);
// Add new
router.get('/subjects/add', subjectViewAdd);
router.post('/subjects/save', subjectSave);
// Update
router.get('/subjects/edit/:id', subjectViewEdit);
router.post('/subjects/update/:id', subjectUpdate);

router.get('/subjects/delete/:id', subjectDelete);


module.exports = {
    routes: router
}

