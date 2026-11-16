const { COMMON_PASSWORDS, COMMON_WORDS } = require("./data/commonPasswords");

// ---------- Character classes (regular expressions) ----------
const hasLower = (p) => /[a-z]/.test(p);
const hasUpper = (p) => /[A-Z]/.test(p);
const hasDigit = (p) => /\d/.test(p);
const hasSymbol = (p) => /[^A-Za-z0-9\s]/.test(p);

// ---------- Pattern detectors ----------
const hasRepeat = (p) => /(.)\1{2,}/.test(p); // aaa, 111

const hasYear = (p) => /(?:19|20)\d{2}/.test(p); // 1998, 2024

// abc, cba, 123, 321 (3+ characters going up or down by 1)
function hasSequence(p, minLength = 3) {
  const s = p.toLowerCase();
  let run = 1;
  let dir = 0;
  for (let i = 1; i < s.length; i++) {
    const diff = s.charCodeAt(i) - s.charCodeAt(i - 1);
    if ((diff === 1 || diff === -1) && (dir === 0 || diff === dir)) {
      dir = diff;
      run++;
      if (run >= minLength) return true;
    } else {
      dir = diff === 1 || diff === -1 ? diff : 0;
      run = dir === 0 ? 1 : 2;
    }
  }
  return false;
}

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

// qwer, asdf, 4567 (any 4 characters in a row on the keyboard, either direction)
function hasKeyboardWalk(p, windowSize = 4) {
  const s = p.toLowerCase();
  for (let i = 0; i + windowSize <= s.length; i++) {
    const chunk = s.slice(i, i + windowSize);
    const reversed = chunk.split("").reverse().join("");
    for (const row of KEYBOARD_ROWS) {
      if (row.includes(chunk) || row.includes(reversed)) return true;
    }
  }
  return false;
}

// Turn p@ssw0rd into password so leetspeak can't hide common words
const LEET_MAP = { "@": "a", "4": "a", "0": "o", "1": "l", "!": "i", "3": "e", "$": "s", "5": "s", "7": "t" };
function normalizeLeet(p) {
  return p
    .toLowerCase()
    .split("")
    .map((c) => LEET_MAP[c] || c)
    .join("");
}

function isCommonPassword(p) {
  const lower = p.toLowerCase();
  return COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(normalizeLeet(p));
}

function findCommonWord(p) {
  const candidates = [p.toLowerCase(), normalizeLeet(p)];
  for (const text of candidates) {
    for (const word of COMMON_WORDS) {
      if (text.includes(word)) return word;
    }
  }
  return null;
}

module.exports = {
  hasLower, hasUpper, hasDigit, hasSymbol,
  hasRepeat, hasYear, hasSequence, hasKeyboardWalk,
  isCommonPassword, findCommonWord, normalizeLeet,
};
