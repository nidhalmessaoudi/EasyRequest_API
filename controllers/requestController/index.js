const Request = require("../../models/Request/index");

exports.postRequest = async (req, res) => {
  try {
    if (!req.body) throw new Error("The request body is missing");
    const request = await Request.create(req.body);
    res.status(201).json({
      status: "sucess",
      request,
    });
  } catch(err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Failed to create a new request",
    });
  }
};
