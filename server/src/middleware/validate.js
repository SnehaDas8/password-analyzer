const MAX_LENGTH = 128;

function validatePassword(req, res, next) {
  const password = req.body && req.body.password;

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Password must be a non-empty string" });
  }
  if (password.length > MAX_LENGTH) {
    return res.status(400).json({ error: `Password must be at most ${MAX_LENGTH} characters` });
  }
  next();
}

module.exports = validatePassword;
