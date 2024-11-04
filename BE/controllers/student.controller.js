const studentModel = require('../models/student');

const studentController = {
  async createStudent(req, res) {
    try {
      const student = await studentModel.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllStudents(req, res) {
    try {
      const students = await studentModel.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getStudentByNpm(req, res) {
    try {
      const student = await studentModel.getStudentByNpm(req.params.npm);
      res.json(student);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async updateStudent(req, res) {
    try {
      const student = await studentModel.updateStudent(req.params.npm, req.body);
      res.json(student);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async deleteStudent(req, res) {
    try {
      const result = await studentModel.deleteStudent(req.params.npm);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
};

module.exports = studentController;