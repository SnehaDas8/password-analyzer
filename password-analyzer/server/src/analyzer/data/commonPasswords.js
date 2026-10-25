// A small starter list. For a stronger check, replace with the top 10,000
// passwords from the SecLists GitHub project (one per line) and load them here.
const COMMON_PASSWORDS = [
  "123456", "123456789", "12345678", "12345", "1234567", "1234567890", "111111",
  "000000", "123123", "654321", "666666", "121212", "112233", "987654321",
  "password", "password1", "password123", "passw0rd", "p@ssword", "p@ssw0rd",
  "qwerty", "qwerty123", "qwertyuiop", "asdfghjkl", "zxcvbnm", "1q2w3e4r",
  "1qaz2wsx", "abc123", "abcd1234", "abcdef", "admin", "admin123", "administrator",
  "login", "welcome", "welcome1", "letmein", "iloveyou", "monkey", "dragon",
  "master", "sunshine", "princess", "football", "baseball", "superman", "batman",
  "shadow", "michael", "jessica", "charlie", "donald", "freedom", "whatever",
  "trustno1", "hello", "hello123", "secret", "test", "test123", "changeme",
  "default", "guest", "root", "user", "love", "angel", "ashley", "flower",
  "cricket", "india", "india123", "kolkata", "bengal", "krishna", "ganesh"
];

// Words (4+ letters) that should not appear inside a password.
const COMMON_WORDS = [
  "password", "passwd", "welcome", "monkey", "dragon", "master", "sunshine",
  "princess", "football", "baseball", "iloveyou", "letmein", "admin", "login",
  "shadow", "superman", "batman", "hello", "secret", "freedom", "whatever",
  "qwerty", "love", "india", "cricket"
];

module.exports = {
  COMMON_PASSWORDS: new Set(COMMON_PASSWORDS),
  COMMON_WORDS,
};
