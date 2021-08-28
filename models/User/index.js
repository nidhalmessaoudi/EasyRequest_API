const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    numberOfRequests: {
      all: {
        type: Number,
        default: 0,
      },
      successful: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("successfulRequests", {
  ref: "Request",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("failedRequests", {
  ref: "Request",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("findOne", (next) => {
  this.populate("successfulRequests failedRequests");
  next();
});

module.exports = new mongoose.model("User", userSchema);
