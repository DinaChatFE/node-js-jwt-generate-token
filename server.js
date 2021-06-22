/* ADD this be able to call require as an old version */
const require = createRequire(import.meta.url);
import express from "express";
import bodyParser from "body-parser";
const app = express();
import tokenMiddleware from "./middleware/index.js";
import { createRequire } from "module";
import auth from "./controllers/auth.js";
import insertTest from "./controllers/insertTest.js";
/* ==Start== // add these script to config environment in node js*/
const path = require("path");
const __dirname = path.resolve(path.dirname(""));
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
/* ==END== */

/* JWT */

app.use(bodyParser({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

/* collapse to see command hint */
function junkCommand() {
  // ==EXAMPLE OF USING MIDDLEWARE IN NODE JS
  // app.use((req, res, next) => {
  //   const token = req.query.token || "createdAt";
  //   if (token !== "2233") {
  //     res.status(401).json({ error: "cannot go a head" });
  //   } else {
  //     next();
  //   }
  // }); */
}

/* =======Connect to mysql server================= */
insertTest.startConnection();

app.post("/api/auth/login", (req, res) => auth.loginController(req, res));

app.get("/api/auth/profile", tokenMiddleware, (req, res) =>
  auth.getProfileController(req, res)
);

app.post("/api/insert-test", tokenMiddleware, (req, res) =>
  insertTest.insertUsersController(req, res)
);

app.get("/api/insert-test", tokenMiddleware, (req, res) =>
  insertTest.getUsersController(req, res)
);

app.get("/api/product", tokenMiddleware, (req, res) =>
  insertTest.getProductLocals(req, res)
);

app.listen(3030, function () {
  console.log(
    "server has been running on port 3030 see http://localhost:3030 \n \t > npm start to run code"
  );
});
