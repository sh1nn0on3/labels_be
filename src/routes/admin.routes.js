const express = require('express');
const router = express.Router();


router.get('/admin', (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});


module.exports = router;