// portfolio.node/src/server.js
const { createApp } = require("./app");

const PORT = process.env.PORT || 5000;

createApp()
  .then(app => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to create app:", err);
  });
