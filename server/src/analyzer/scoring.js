// Score = length points + variety points - penalties (0 to 100)

function labelFor(score) {
  if (score < 25) return "Very Weak";
  if (score < 50) return "Weak";
  if (score < 70) return "Fair";
  if (score < 85) return "Strong";
  return "Very Strong";
}

function calculateScore({ length, checks, issueTypes }) {
  const lengthPoints = Math.min(length, 20) * 2.5; // max 50
  const classes = [checks.hasLower, checks.hasUpper, checks.hasDigit, checks.hasSymbol];
  const varietyPoints = classes.filter(Boolean).length * 12.5; // max 50

  const PENALTIES = {
    repeat: 10,
    sequence: 10,
    keyboard_walk: 15,
    common_word: 25,
    year: 5,
    letters_only: 5,
    digits_only: 10,
  };

  let score = lengthPoints + varietyPoints;
  for (const type of issueTypes) {
    score -= PENALTIES[type] || 0;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  // Very short passwords can never score well, however varied they are
  if (length < 8) {
    score = Math.min(score, 35);
  }

  // A password on the common list is always very weak
  if (issueTypes.includes("common_password")) {
    score = Math.min(score, 10);
  }
  return score;
}

module.exports = { calculateScore, labelFor };
