const MetadataSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entityType: { type: String, enum: ["Project", "BlogEntry", "File"], required: true },
  });
  