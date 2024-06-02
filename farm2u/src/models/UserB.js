const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "Please enter the heading of the order"],
  },
  image: {
    type: String,
    required: [true, "Please enter the image URL of the order"],
  },
  quantity: {
    type: Number,
    required: [true, "Please enter the quantity of the order"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the price of the order"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
});
const AddressSchema = new mongoose.Schema({
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
});
const UserBSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "please enter your firstname"],
    trim: true,
    maxLength: [20, "Firstname cannot be more than 20 characters"],
  },
  lastname: {
    type: String,
    required: [true, "please enter your lastname"],
    trim: true,
    maxLength: [20, "Lastname cannot be more than 20 characters"],
  },
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
  password: {
    type: String,
    required: [true, "please enter a valid password"],
  },
  role: {
    type: String,
    required: [true, "role should be mentioned"],
  },
  address: [AddressSchema],
  cart: [
    {
      productId: {
        type: String,
        required: [true, "productId required."],
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orders: [OrderSchema],
});
module.exports = mongoose.models.UserB || mongoose.model("UserB", UserBSchema);
