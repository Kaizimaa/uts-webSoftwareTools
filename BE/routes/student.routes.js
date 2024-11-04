const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { validateStudent } = require('../middleware/validator');

router.post('/', validateStudent, studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/:npm', studentController.getStudentByNpm);
router.put('/:npm', validateStudent, studentController.updateStudent);
router.delete('/:npm', studentController.deleteStudent);

module.exports = router;