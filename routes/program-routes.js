const express = require('express');

const {programSearch, programViewAdd, programSave, programViewEdit,
    programUpdate, programDelete}
    = require('../controllers/programController')
const router = express.Router();

router.get('/programs', programSearch);
// Add new
router.get('/programs/add', programViewAdd);
router.post('/programs/save', programSave);
// Update
router.get('/programs/edit/:id', programViewEdit);
router.post('/programs/update/:id', programUpdate);

router.get('/programs/delete/:id', programDelete);


module.exports = {
    routes: router
}

