const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const DB = require("./Database.js");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.EXPRESS_PORT
const routes = require("./routes/index");
const Auth = require("./AuthRoutes/Auth.js");
app.use("/", routes);
app.use("/auth", Auth);

app.listen(port, () => console.log(">>>>", port));
