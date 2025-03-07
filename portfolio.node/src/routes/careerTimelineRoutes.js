const express = require("express");
const CareerTimeline = require("../models/CareerTimeline");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");
const cheerio = require("cheerio");

// GET all career timeline entries
router.get("/timeline", async (req, res) => {
  try {
    const entries = await CareerTimeline.find().sort({ startDate: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching career timeline entries." });
  }
});

// GET a single timeline entry
router.get("/timeline/:id", async (req, res) => {
  try {
    const entry = await CareerTimeline.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found." });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

// CREATE a new career timeline entry
router.post("/timeline", isAuth, isAdmin, async (req, res) => {
  try {
    const newEntry = new CareerTimeline(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: "Invalid data." });
  }
});

// UPDATE an existing entry
router.put("/timeline/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const updatedEntry = await CareerTimeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ error: "Entry not found." });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: "Invalid update request." });
  }
});

// DELETE an entry
router.delete("/timeline/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const deletedEntry = await CareerTimeline.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ error: "Entry not found." });
    res.json({ message: "Entry deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting entry." });
  }
});

// API to parse LinkedIn HTML
router.post("/parse-linkedin", async (req, res) => {
  try {
    const { rawHTML } = req.body;
    if (!rawHTML) return res.status(400).json({ error: "No HTML provided" });

    const $ = cheerio.load(rawHTML);
    const jobs = [];

    // Iterate over each job entry
    $(".artdeco-list__item").each((_, element) => {
      const company = $(element).find("a.optional-action-target-wrapper span[aria-hidden='true']").first().text().trim();
      const companyLink = $(element).find("a.optional-action-target-wrapper").attr("href");
      const companyLogo = $(element).find("img.ivm-view-attr__img--centered").attr("src");

      // Extract job title
      $(element).find("div.t-bold span[aria-hidden='true']").each((_, jobElement) => {
        const title = $(jobElement).text().trim();

        // Extract date range
        const dateRange = $(element).find("span.pvs-entity__caption-wrapper").first().text().trim();
        let startDate = "", endDate = "Present";
        if (dateRange.includes(" - ")) {
          const dates = dateRange.split(" - ");
          startDate = dates[0]?.trim();
          endDate = dates[1]?.trim() || "Present";
        }

        // Extract location
        const location = $(element).find("span.t-14.t-normal.t-black--light").last().text().trim();

        // Extract job description
        const description = $(element).find("div.WcTepSkGpUVWbbheKPCszGxDQzmhiNFQ span[aria-hidden='true']").text().trim();

        // Ensure valid job entry
        if (title ) {
          jobs.push({
            title,
            company,
            companyLink: companyLink ? `https://www.linkedin.com${companyLink}` : null,
            companyLogo,
            startDate,
            endDate,
            location,
            description,
          });
        }
      });
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error parsing LinkedIn data:", error);
    res.status(500).json({ error: "Failed to parse LinkedIn data." });
  }
});

function parseDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes("present")) {
    return null; // Store null for current jobs
  }
  
  // Extract only the first part of the date (e.g., "Jan 2018" from "Jan 2018 · 4 yrs 7 mos")
  const cleanDate = dateStr.split("·")[0].trim();

  // Convert to a valid Date object
  const parsedDate = new Date(cleanDate);
  return isNaN(parsedDate) ? null : parsedDate;
}

// Bulk insert parsed jobs into the database
router.post("/timeline/bulk", isAuth, isAdmin, async (req, res) => {
  try {
    console.log('req.body', req.body);
    
    const entries = req.body.map((entry) => ({
      title: entry.title,
      company: entry.company,
      startDate: parseDate(entry.startDate),
      endDate: parseDate(entry.endDate),
      location: entry.location,
      description: entry.description,
      importedFromLinkedIn: true,
    }));

    await CareerTimeline.insertMany(entries);
    res.json({ success: true, message: "Career entries imported successfully." });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ error: "Failed to import LinkedIn data." });
  }
});

module.exports = router;
