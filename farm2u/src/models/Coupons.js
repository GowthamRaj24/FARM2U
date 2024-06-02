const mongoose = require("mongoose");
const CoupnSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  coupon: {
    type: String,
    required: true,
  },
});
module.exports =
  mongoose.models.Coupons || mongoose.model("Coupons", CoupnSchema);
