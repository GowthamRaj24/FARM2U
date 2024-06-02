const mongoose = require("mongoose");
const NotifyEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
});
module.exports =
  mongoose.models.NotifyEmail ||
  mongoose.model("NotifyEmail", NotifyEmailSchema);
