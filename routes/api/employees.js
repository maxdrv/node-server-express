const express = require('express');
const router = express.Router();
const {getAllEmployees, updateEmployee, createNewEmployee, deleteEmployee, getEmployee} = require("../../controllers/employeesController");
const ROLES_LiST = require('../../config/role_list');
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(getAllEmployees)
    .post(
        verifyRoles(ROLES_LiST.Admin, ROLES_LiST.Editor),
        createNewEmployee
    )
    .put(
        verifyRoles(ROLES_LiST.Admin, ROLES_LiST.Editor),
        updateEmployee
    )
    .delete(
        verifyRoles(ROLES_LiST.Admin),
        deleteEmployee
    );

router.route('/:id')
    .get(getEmployee);

module.exports = router;