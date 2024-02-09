const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const user = require("./routes/userRoutes");
const url = require("./routes/urlRoutes");

app.use("/auth", user);
app.use("/url", url);

connectDatabase();

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
