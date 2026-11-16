const express = require("express");
const validatePassword = require("../middleware/validate");
const { analyzePassword } = require("../analyzer");

const router = express.Router();

// POST /api/analyze   body: { "password": "..." }
// PRIVACY: never log req.body, never store the password.
router.post("/", validatePassword, (req, res) => {
  const result = analyzePassword(req.body.password);
  res.json(result);
});

module.exports = router;
