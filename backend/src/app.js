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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            color: white;
          }

          .container {
            text-align: center;
            padding: 2rem;
            margin: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 90%;
            width: 600px;
          }

          h1 {
            font-size: 2.5rem;
            margin: 0 0 1rem 0;
            background: linear-gradient(45deg, #00b4d8, #90e0ef);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .subtitle {
            font-size: 1.2rem;
            color: #90e0ef;
            margin-bottom: 2rem;
          }

          .status-box {
            background: rgba(0, 180, 216, 0.1);
            padding: 1rem;
            border-radius: 10px;
            margin: 1.5rem 0;
          }

          .status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .dot {
            height: 12px;
            width: 12px;
            background: #00cc66;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.1); }
            100% { transform: scale(0.95); }
          }

          .info-text {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 1.5rem;
          }

          /* Responsive Mobile */
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
            
            .container {
              padding: 1.5rem;
              border-radius: 12px;
            }
            
            .subtitle {
              font-size: 1rem;
            }
            
            .status {
              font-size: 0.9rem;
            }
            
            .info-text {
              font-size: 0.8rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>DinsSphere InterConnected</h1>
          <p class="subtitle">Server is Running...</p>
          
          <div class="status-box">
            <div class="status">
              <div class="dot"></div>
              <span>Operational • All Systems Normal</span>
            </div>
          </div>
          
          <div class="info-text">
            Version 2.1.0 • ${new Date().toLocaleString()}
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