const express = require('express');

const {roomSearch, roomViewAdd, roomSave, roomViewEdit,
    roomUpdate, roomDelete}
    = require('../controllers/roomController')
const router = express.Router();

router.get('/rooms', roomSearch);
// Add new
router.get('/rooms/add', roomViewAdd);
router.post('/rooms/save', roomSave);
// Update
router.get('/rooms/edit/:id', roomViewEdit);
router.post('/rooms/update/:id', roomUpdate);

router.get('/rooms/delete/:id', roomDelete);


module.exports = {
    routes: router
}

