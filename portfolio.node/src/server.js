// portfolio.node/src/server.js
const http = require("http");
const { createApp } = require("./app");
const { setupWebSocketServer } = require("./services/wsChatService");

const PORT = process.env.PORT || 5000;

createApp()
  .then(app => {
    // Create HTTP Server
    const server = http.createServer(app);

    // Attach WebSocket Server to HTTP Server
    setupWebSocketServer(server);

    server.listen(PORT, () => console.log(`Server running on port ${PORT} with WebSocket support`));
  })
  .catch(err => {
    console.error("Failed to create app:", err);
  });
