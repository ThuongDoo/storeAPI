const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/dynamic").get(getProducts);
router.route("/:id").delete(deleteProduct).patch(updateProduct);

module.exports = router;
