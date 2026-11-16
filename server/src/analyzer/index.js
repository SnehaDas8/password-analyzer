const c = require("./checks");
const { calculateScore, labelFor } = require("./scoring");
const { buildRecommendations } = require("./recommendations");

function analyzePassword(password) {
  const length = password.length;

  const checks = {
    hasLower: c.hasLower(password),
    hasUpper: c.hasUpper(password),
    hasDigit: c.hasDigit(password),
    hasSymbol: c.hasSymbol(password),
    minLength: length >= 12,
  };

  const issues = [];

  if (c.isCommonPassword(password)) {
    issues.push({ type: "common_password", message: "This password appears on lists of commonly used passwords" });
  } else {
    const word = c.findCommonWord(password);
    if (word) issues.push({ type: "common_word", message: `Contains a common word: '${word}'` });
  }
  if (c.hasKeyboardWalk(password)) issues.push({ type: "keyboard_walk", message: "Contains a keyboard pattern" });
  if (c.hasSequence(password)) issues.push({ type: "sequence", message: "Contains a sequence like abc or 123" });
  if (c.hasRepeat(password)) issues.push({ type: "repeat", message: "Contains repeated characters" });
  if (c.hasYear(password)) issues.push({ type: "year", message: "Contains a year" });
  if (/^[A-Za-z]+$/.test(password)) issues.push({ type: "letters_only", message: "Uses letters only" });
  if (/^\d+$/.test(password)) issues.push({ type: "digits_only", message: "Uses digits only" });

  const score = calculateScore({
    length, checks, issueTypes: issues.map((i) => i.type),
  });

  return {
    score,
    label: labelFor(score),
    length,
     checks,
    issues,
    recommendations: buildRecommendations({ length, checks, issues, score }),
  };
}

module.exports = { analyzePassword };
