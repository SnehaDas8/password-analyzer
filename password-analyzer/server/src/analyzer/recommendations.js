const TIPS = {
  common_password: "This is a very common password. Pick something completely different",
  common_word: "Avoid common words, even with symbol swaps like @ for a",
  keyboard_walk: "Avoid keyboard patterns like 'qwerty' or 'asdf'",
  sequence: "Avoid sequences like 'abc' or '1234'",
  repeat: "Avoid repeated characters like 'aaa' or '111'",
  year: "Remove years or dates. They are easy to guess",
  letters_only: "Mix in numbers and symbols, not just letters",
  digits_only: "Use letters and symbols, not just numbers",
};

function buildRecommendations({ length, checks, issues, score }) {
  const tips = [];

  for (const issue of issues) {
    if (TIPS[issue.type]) tips.push(TIPS[issue.type]);
  }
  if (length < 12) tips.push("Use at least 12 characters");
  if (!checks.hasUpper) tips.push("Add uppercase letters");
  if (!checks.hasLower) tips.push("Add lowercase letters");
  if (!checks.hasDigit) tips.push("Add numbers");
  if (!checks.hasSymbol) tips.push("Add symbols like ! @ # $");

  if (tips.length === 0 && score >= 85) {
    return ["Great password! Never reuse it across different sites."];
  }
  if (score < 85) tips.push("Try a passphrase of 4 or more unrelated words");

  return [...new Set(tips)].slice(0, 5);
}

module.exports = { buildRecommendations };
