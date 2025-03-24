const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json([]);
});

router.get("/:documentId", async (req, res) => {
    res.json({});
});


router.post("/:documentId/search-test", async (req, res) => {
    
});

router.post("/:documentId/regenerate", async (req, res) => {
    
});

module.exports = router;