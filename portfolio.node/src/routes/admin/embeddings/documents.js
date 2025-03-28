const express = require("express");
const router = express.Router();
const collectionMap = require("../../../utils/collections");


router.get("/collection/:name", async (req, res) => {

    const collectionName = req.params.name;
    const model = await collectionMap.getCollectionByName(collectionName);
    const documents = await model.find();
    res.json(documents);
});

router.get("/:documentId", async (req, res) => {
    res.json({});
});


router.post("/:documentId/search-test", async (req, res) => {
    
});

router.post("/:documentId/regenerate", async (req, res) => {
    
});

module.exports = router;