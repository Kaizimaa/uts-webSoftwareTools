const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validasi input
      if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password harus diisi' });
      }

      // Validasi panjang password
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter' });
      }

      const user = await userModel.createUser({ username, password });
      res.status(201).json({
        message: 'Registrasi berhasil',
        user
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password harus diisi' });
      }

      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;