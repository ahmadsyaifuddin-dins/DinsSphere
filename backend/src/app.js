const express = require("express");
const cors = require("cors");
const connectDB = require("./config/server");
const projectRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");
const viewsRoutes = require("./routes/views");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>DinsSphere Status</title>
        <style>
          body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            color: white;
          }

          .container {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          h1 {
            font-size: 2.5rem;
            margin: 0;
            background: linear-gradient(45deg, #00b4d8, #90e0ef);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 1.5rem;
          }

          .dot {
            height: 15px;
            width: 15px;
            background: #00cc66;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.1); }
            100% { transform: scale(0.95); }
          }

          .version {
            margin-top: 2rem;
            opacity: 0.8;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 DinsSphere InterConnected</h1>
          <div class="status">
            <div class="dot"></div>
            <span>Operational • All Systems Normal</span>
          </div>
          <div class="version">
            v2.1.0 • ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
    </html>
  `;

  res.send(htmlResponse);
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", viewsRoutes);

module.exports = app;