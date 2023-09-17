const Product = require("../models/product");
const { NotFoundError } = require("../errors");

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, nbHits: products.length });
};

const getProducts = async (req, res) => {
  const { name, company, sort, field, numericFilters } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (company) {
    queryObject.company = company;
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (field) {
    const fieldList = field.split(",").join(" ");
    result = result.select(fieldList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndDelete({ _id: productID });
  if (!product) {
    throw new NotFoundError(`No task with ID: `);
  }
  res.status(200).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productID } = req.params;
  console.log(req.params);
  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`No task with ID: `);
  }
  res.status(200).json({ product });
};

module.exports = {
  getAllProducts,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
};
