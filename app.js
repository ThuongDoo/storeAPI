require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const authenticateUser = require("./middlewares/authentication");

//routers
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/auth");

//error handler
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

app.set("trust proxy", 1);
app.use(rateLimiter({ windowMS: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
app.use("/api/v1/auth", usersRouter);
app.use("/api/v1/products", authenticateUser, productsRouter);

//product routes

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`SERVER IS LISTENING ON PORT ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
