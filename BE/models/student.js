const { db } = require('../config/firebase-config');

const studentCollection = db.ref('students');

const studentModel = {
  async createStudent(data) {
    try {
      const { npm, nama, kelas } = data;
      
      // Check if NPM already exists
      const snapshot = await studentCollection.child(npm).once('value');
      if (snapshot.exists()) {
        throw new Error('NPM sudah terdaftar');
      }

      // Create new student
      await studentCollection.child(npm).set({
        nama,
        kelas,
        createdAt: new Date().toISOString()
      });

      return { npm, nama, kelas };
    } catch (error) {
      throw error;
    }
  },

  async getAllStudents() {
    try {
      const snapshot = await studentCollection.once('value');
      const students = [];
      
      snapshot.forEach(childSnapshot => {
        students.push({
          npm: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return students;
    } catch (error) {
      throw error;
    }
  },

  async getStudentByNpm(npm) {
    try {
      const snapshot = await studentCollection.child(npm).once('value');
      if (!snapshot.exists()) {
        throw new Error('Mahasiswa tidak ditemukan');
      }
      return {
        npm,
        ...snapshot.val()
      };
    } catch (error) {
      throw error;
    }
  },

  async updateStudent(npm, data) {
    try {
      const snapshot = await studentCollection.child(npm).once('value');
      if (!snapshot.exists()) {
        throw new Error('Mahasiswa tidak ditemukan');
      }

      await studentCollection.child(npm).update({
        ...data,
        updatedAt: new Date().toISOString()
      });

      return {
        npm,
        ...data
      };
    } catch (error) {
      throw error;
    }
  },

  async deleteStudent(npm) {
    try {
      const snapshot = await studentCollection.child(npm).once('value');
      if (!snapshot.exists()) {
        throw new Error('Mahasiswa tidak ditemukan');
      }

      await studentCollection.child(npm).remove();
      return { message: 'Mahasiswa berhasil dihapus' };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = studentModel;