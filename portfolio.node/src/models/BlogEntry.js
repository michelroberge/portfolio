const mongoose = require("mongoose");

const BlogEntrySchema = new mongoose.Schema({
  title: String,
  date: String,
  excerpt: String,
  body: String,
  link: String,
});

BlogEntrySchema.pre('save', function(next) {
  // Generate slug from title - convert to lowercase, replace spaces with hyphens,
  // remove special characters
  const slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Remove consecutive hyphens
  
  // Option 1: Just use the slug
  this.link = `${slug}-${this._id}`;
  
  // Option 2: Include date for better organization (YYYY-MM-DD format)
  // Assuming date is stored as a string in format that can be parsed by Date
  // const dateObj = new Date(this.date);
  // const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  // this.link = `/blogs/${formattedDate}-${slug}-${this._id}`;
  
  next();
});

module.exports = mongoose.model("BlogEntry", BlogEntrySchema);
