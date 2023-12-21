const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    name: { type: String },
    file: { type: String },
    postName: { type: String },
    fileType: { type: String },
    category: { type: String },
    experience: { type: String },
    keywords: [String],
    adult: { type: Boolean },
    rejectReason: { type: String },
    profilePic: { type: String },
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "pending",
    },
    views: { type: Number, default: 0 },
    downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    likedCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    recommended: {type:Boolean, default: false},
    slug:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("images", imageSchema);
