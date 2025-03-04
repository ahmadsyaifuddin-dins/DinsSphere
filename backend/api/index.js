// api/index.js
const app = require("../src/app");

// Di serverless Vercel, kita TIDAK pakai app.listen()
// cukup export app aja.
module.exports = app;
