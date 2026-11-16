const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

let server, base;
test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});
test.after(() => server.close());

const post = (body) =>
  fetch(`${base}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

test("valid password returns 200 and a score", async () => {
  const res = await post({ password: "Hello123!" });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok("score" in data && "label" in data);
});

test("missing password returns 400", async () => {
  assert.strictEqual((await post({})).status, 400);
});

test("non-string password returns 400", async () => {
  assert.strictEqual((await post({ password: 12345 })).status, 400);
});

test("password over 128 chars returns 400", async () => {
  assert.strictEqual((await post({ password: "a".repeat(129) })).status, 400);
});

test("broken JSON returns 400", async () => {
  assert.strictEqual((await post("{bad json")).status, 400);
});

test("health route works", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.strictEqual(res.status, 200);
});
