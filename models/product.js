const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "product name must be provided"],
    },
    price: {
      type: Number,
      require: [true, "product price must be provided"],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    company: {
      type: String,
      enum: {
        values: ["Nokia", "Samsung", "Apple", "Sony"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
