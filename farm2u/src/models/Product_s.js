const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  image1: {
    type: String,
    required: true,
    trim: true,
  },
  image2: {
    type: String,
    required: true,
    trim: true,
  },
  image3: {
    type: String,
    required: true,
    trim: true,
  },
  image4: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0, // Set a default value if needed
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    trim: true,
    default: 0, // Set a default value if needed
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category:{
    type:String
  },
  seller:{
    type:String,
  },
  sellerName:{
    type:String
  },
  comments: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      publishDate: {
        type: Date, // Use Date type for dates
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        trim: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

module.exports =
  mongoose.models.Product_s || mongoose.model("Product_s", ProductSchema);
