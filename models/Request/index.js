const mongoose = require("mongoose");

const User = require("../User/index.js");

const requestSchema = new mongoose.Schema({
  isSuccessful: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  statusCode: Number,
  responseTime: Number,
  responseSize: Number,
  message: String,
});

requestSchema.pre("findOne", (next) => {
  this.populate("user");
  next();
});

requestSchema.pre("save", (next) => {
  const user = await User.findOne({ _id: this.user });
  user.numberOfRequests.all += 1;
  this.isSuccessful
    ? (user.numberOfRequests.successful += 1)
    : (user.numberOfRequests.failed += 1);
  next();
});

module.exports = mongoose.model("Request", requestSchema);
