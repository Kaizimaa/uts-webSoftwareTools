const { db } = require('../config/firebase-config');
const bcrypt = require('bcryptjs');

const userCollection = db.ref('users');

const userModel = {
  async createUser(data) {
    try {
      const { username, password } = data;
      
      // Check if username already exists
      const snapshot = await userCollection.child(username).once('value');
      if (snapshot.exists()) {
        throw new Error('Username sudah terdaftar');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user using username as key
      await userCollection.child(username).set({
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      return { username };
    } catch (error) {
      throw error;
    }
  },

  async findByUsername(username) {
    try {
      const snapshot = await userCollection.child(username).once('value');
      if (!snapshot.exists()) {
        return null;
      }

      return {
        username,
        ...snapshot.val()
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userModel;