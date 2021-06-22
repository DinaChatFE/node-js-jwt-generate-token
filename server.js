/* ADD this be able to call require as an old version */
const require = createRequire(import.meta.url);
import express, { response } from "express";
import bodyParser from "body-parser";
const app = express();
import tokenMiddleware from "./middleware/index.js";
import { createRequire } from "module";
const jwt = require("jsonwebtoken");
import databases from "./databases";

/* ==Start== // add these script to config environment in node js*/
const path = require("path");
const __dirname = path.resolve(path.dirname(""));
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
/* ==END== */

/* JWT */
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

app.use(bodyParser({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

/* 
==EXAMPLE OF USING MIDDLEWARE IN NODE JS
app.use((req, res, next) => {
  const token = req.query.token || "createdAt";
  if (token !== "2233") {
    res.status(401).json({ error: "cannot go a head" });
  } else {
    next();
  }
}); */

/* jwt create token */

app.post("/api/auth/login", (req, res) => {
  const userLogin = databases.user.filter(u => u.email === req.body.email);

  userLogin.length === 0 && errorMessage(res);

  if (userLogin[0].password === req.body.password) {
    const token = generateAccessToken({ username: req.body.email });
    return res.json({ data: userLogin[0], token });
  } else {
    errorMessage(res);
  }
});
function errorMessage(res) {
  res
    .status(401)
    .json({ error: "Your credential doesn't match, please try again" });
}

app.get("/api/auth/profile", tokenMiddleware, (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    return res.send({ data: user });
  });
});

app.get("/api/product", tokenMiddleware, function (req, res) {
  res.send({ products: databases.product });
});

app.listen(3030, function () {
  console.log("server has been running on port 3030 see http://localhost:3030");
});
