const Request = require("./models/Request/index.js");

exports.postRequest = async (req, res) => {
  try {
    const request = await Request.create(req.body);
    res.status(201).json({
      status: "sucess",
      request,
    });
  } catch {
    res.status(400).json({
      status: "fail",
      message: "Failed to create a new request.",
    });
  }
};
