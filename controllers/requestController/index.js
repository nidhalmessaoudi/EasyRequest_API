const Request = require("../../models/Request/index");

exports.postRequest = async function (req, res) {
  try {
    if (req.body.isSuccessful === null || req.body.isSuccessful === undefined) {
      throw new Error("The request body is missing 'isSuccessful' field");
    }
    const request = await Request.create(req.body);
    res.status(201).json({
      status: "success",
      request,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Failed to create a new request",
    });
  }
};
