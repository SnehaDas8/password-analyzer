const test = require("node:test");
const assert = require("node:assert");
const { analyzePassword } = require("../src/analyzer");

const types = (r) => r.issues.map((i) => i.type);

test("123456 is Very Weak", () => {
  const r = analyzePassword("123456");
  assert.strictEqual(r.label, "Very Weak");
  assert.ok(r.score <= 10);
});

test("password scores 10 or less", () => {
  assert.ok(analyzePassword("password").score <= 10);
});

test("leetspeak P@ssw0rd is caught as common", () => {
  const r = analyzePassword("P@ssw0rd");
  assert.ok(types(r).includes("common_password"));
  assert.ok(r.score <= 10);
});

test("qwerty123 flags keyboard walk", () => {
  assert.ok(types(analyzePassword("qwerty123")).includes("keyboard_walk"));
});

test("aaaaaaaa flags repeat", () => {
  assert.ok(types(analyzePassword("aaaaaaaa")).includes("repeat"));
});

test("abc123xyz flags sequence", () => {
  assert.ok(types(analyzePassword("abc123xyz")).includes("sequence"));
});

test("year is detected", () => {
  assert.ok(types(analyzePassword("Rahul1998!")).includes("year"));
});

test("digits only is flagged", () => {
  assert.ok(types(analyzePassword("8472916350")).includes("digits_only"));
});

test("letters only is flagged", () => {
  assert.ok(types(analyzePassword("Tkzmqpwbxe")).includes("letters_only"));
});

test("short mixed password is Weak or lower", () => {
  assert.ok(analyzePassword("Ab3$").score < 50);
});

test("long passphrase is Strong or better", () => {
  const r = analyzePassword("correct-horse-battery-staple");
  assert.ok(r.score >= 70, `score was ${r.score}`);
});

test("random mixed 16-char password is Very Strong", () => {
  const r = analyzePassword("vT9#kQm2$Zx7!wRp");
  assert.strictEqual(r.label, "Very Strong");
  assert.ok(r.recommendations[0].startsWith("Great"));
});

test("response has the agreed shape", () => {
  const r = analyzePassword("Hello123!");
  for (const key of ["score", "label", "length", "entropy", "checks", "issues", "recommendations"]) {
    assert.ok(key in r, `missing ${key}`);
  }
  assert.ok(r.score >= 0 && r.score <= 100);
});

test("recommendations never exceed 5", () => {
  assert.ok(analyzePassword("a").recommendations.length <= 5);
});
