const mongoose = require("mongoose");

const companySubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    paymentId: { type: String },
    planName: {type: String},
    activeJobs: {type:Number},
    directHires: {type:Number},
    draftJobs:{type:Number},
    bookmarkPilots:{type:Boolean},
    suggestedPilots:{type:Boolean},
    proBadge:{type:Boolean},
    boostJob:{type:Number},
    expiresAt:{type:Date}
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "companySubscription",
  companySubscriptionSchema
);
