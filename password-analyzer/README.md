# Password Strength Analyzer

Analyzes a password's strength (length, character variety, entropy, common
patterns) and gives recommendations.

**Tech:** JavaScript, Node.js, Express.js (React frontend planned as Stage 3)

## Run it

You need Node.js (LTS) from nodejs.org.

```bash
cd server
npm install
npm start
```

Open http://localhost:5000

## Run the tests

```bash
cd server
npm test
```

## Project structure

```
password-analyzer/
├── client/                 Frontend (HTML, CSS, JavaScript)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── server/                 Backend (Node + Express)
    ├── src/
    │   ├── server.js       Starts the server
    │   ├── app.js          Express setup and middleware
    │   ├── routes/analyze.js
    │   ├── middleware/validate.js
    │   └── analyzer/       The analysis engine
    │       ├── index.js            analyzePassword()
    │       ├── checks.js           Regex checks and pattern detectors
    │       ├── scoring.js          Points, penalties, labels
    │       ├── recommendations.js  Tips shown to the user
    │       └── data/commonPasswords.js
    └── tests/
```

## API

`POST /api/analyze` with `{ "password": "..." }`

Returns `score`, `label`, `length`, `entropy`, `checks`, `issues`, `recommendations`.
Errors: 400 (invalid input), 429 (rate limit), 500 (server error).

## Security decisions

- Passwords are never stored or logged.
- POST is used so the password never appears in a URL.
- Request body limited to 1 KB, password limited to 128 characters.
- Rate limiting (60 requests per minute per IP) and Helmet security headers.
- The UI writes results with `textContent`, not `innerHTML`, to prevent XSS.

## Team

| Role | Owns |
|---|---|
| Person A | `client/` |
| Person B | `server/src/analyzer/` |
| Person C | `server/src/` (app, routes, middleware) and tests |
