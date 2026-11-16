const input = document.getElementById("pw");
const toggle = document.getElementById("toggle");
const meter = document.getElementById("meter");
const bar = document.getElementById("bar");
const statusEl = document.getElementById("status");
const details = document.getElementById("details");
const recommendationSection = document.getElementById("recommendation-section");
const checklist = document.getElementById("checklist");
const issuesEl = document.getElementById("issues");
const tipsEl = document.getElementById("tips");

const CHECK_LABELS = {
  minLength: "At least 12 characters",
  hasLower: "Lowercase letter",
  hasUpper: "Uppercase letter",
  hasDigit: "Number",
  hasSymbol: "Symbol",
};

let timer = null;
let controller = null;

// Ask the server to analyze the password.
// POST (not GET) so the password never appears in a URL or server log.
async function analyze(password, signal) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    signal,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Fill a <ul> with text items (textContent, never innerHTML, to avoid XSS)
function fillList(ul, items, className) {
  ul.replaceChildren();
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    if (className) li.className = className;
    ul.appendChild(li);
  });
}

function reset() {
  bar.style.width = "0%";
  bar.className = "meter-fill";
  meter.setAttribute("aria-valuenow", 0);
  statusEl.textContent = "Start typing to see your result.";
  details.hidden = true;
  recommendationSection.hidden = true;
}

function render(r) {
  const cls = r.label.toLowerCase().replace(" ", "-");
  bar.style.width = r.score + "%";
  bar.className = "meter-fill " + cls;
  meter.setAttribute("aria-valuenow", r.score);
  statusEl.textContent = `${r.label} (${r.score}/100)`;

  checklist.replaceChildren();
  Object.keys(CHECK_LABELS).forEach((key) => {
    const li = document.createElement("li");
    li.textContent = CHECK_LABELS[key];
    li.className = r.checks[key] ? "pass" : "fail";
    checklist.appendChild(li);
  });

  fillList(issuesEl, r.issues.length ? r.issues.map((i) => i.message) : ["No weak patterns found"]);
  fillList(tipsEl, r.recommendations);
  details.hidden = false;
  recommendationSection.hidden = false;
}

input.addEventListener("input", () => {
  clearTimeout(timer);
  if (controller) controller.abort(); // cancel the older request

  const password = input.value;
  if (!password) return reset();

  // Debounce: wait 300 ms after the last keystroke
  timer = setTimeout(async () => {
    controller = new AbortController();
    try {
      render(await analyze(password, controller.signal));
    } catch (err) {
      if (err.name === "AbortError") return;
      statusEl.textContent = "Could not reach the server. Is it running?";
      details.hidden = true;
      recommendationSection.hidden = true;
    }
  }, 300);
});

toggle.addEventListener("click", () => {
  const hidden = input.type === "password";
  input.type = hidden ? "text" : "password";
  toggle.textContent = hidden ? "Hide" : "Show";
});