const mongoose = require("mongoose");

const CareerTimelineSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Job title, role, or key milestone
  company: { type: String }, // Employer or organization
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null }, // Null if currently active
  description: { type: String }, // Brief description of responsibilities
  skills: [{ type: String }], // List of skills used
  linkedEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "CareerTimeline" }], // Links to related events
  importedFromLinkedIn: { type: Boolean, default: false }, // Flag for LinkedIn imports
});

module.exports = mongoose.model("CareerTimeline", CareerTimelineSchema);
