const express = require('express');

const {employeeSearch, employeeViewAdd, employeeSave, employeeViewEdit,
    employeeUpdate, employeeDelete}
    = require('../controllers/employeeController')
const router = express.Router();

router.get('/employees', employeeSearch);
// Add new
router.get('/employees/add', employeeViewAdd);
router.post('/employees/save', employeeSave);
// Update
router.get('/employees/edit/:id', employeeViewEdit);
router.post('/employees/update/:id', employeeUpdate);

router.get('/employees/delete/:id', employeeDelete);


module.exports = {
    routes: router
}

