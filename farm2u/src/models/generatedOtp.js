const mongoose = require("mongoose");
const generatedOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});
module.exports =
  mongoose.models.generatedOtp ||
  mongoose.model("generatedOtp", generatedOtpSchema);
