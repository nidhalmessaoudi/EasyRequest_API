const mongoose = require("mongoose");

const User = require("../User/index");

const requestSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

requestSchema.pre(/find/, function (next) {
  this.populate("user");
  next();
});

requestSchema.pre("save", async function (next) {
  const user = await User.findOne({ _id: this.user });
  console.log(user);
  user.numberOfRequests.all += 1;
  this.isSuccessful
    ? (user.numberOfRequests.successful += 1)
    : (user.numberOfRequests.failed += 1);
  user.save();
  next();
});

module.exports = mongoose.model("Request", requestSchema);
