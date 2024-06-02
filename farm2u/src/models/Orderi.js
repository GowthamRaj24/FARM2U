const mongoose = require("mongoose");
const AddressSchema = {
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
    required: [true, "Please enter your city"],
  },
  state: {
    type: String,
    required: [true, "Please enter your state"],
  },
  pincode: {
    type: String,
    required: [true, "Please enter your pincode"],
  },
  country: {
    type: String,
    required: [true, "Please enter your country"],
  },
};
const OrderiSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product_s",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Orderi || mongoose.model("Orderi", OrderiSchema);
