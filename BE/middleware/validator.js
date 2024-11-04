const validateStudent = (req, res, next) => {
    const { npm, nama, kelas } = req.body;
  
    if (!npm || !nama || !kelas) {
      return res.status(400).json({
        error: 'NPM, nama, dan kelas harus diisi'
      });
    }
  
    // Validate NPM format (contoh: harus 8 digit)
    if (!/^\d{8}$/.test(npm)) {
      return res.status(400).json({
        error: 'NPM harus terdiri dari 8 digit angka'
      });
    }
  
    // Validate nama (tidak boleh mengandung angka)
    if (/\d/.test(nama)) {
      return res.status(400).json({
        error: 'Nama tidak boleh mengandung angka'
      });
    }
  
    next();
  };
  
  module.exports = { validateStudent };