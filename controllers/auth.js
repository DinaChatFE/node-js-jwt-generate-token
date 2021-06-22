import databases from "../databases";
import jwt from "jsonwebtoken";

function errorMessage(res) {
  res
    .status(401)
    .json({ error: "Your credential doesn't match, please try again" });
}
/* jwt create token */

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

export default {
  loginController: (req, res) => {
    const userLogin = databases.user.filter(u => u.email === req.body.email);

    userLogin.length === 0 && errorMessage(res);

    if (userLogin[0].password === req.body.password) {
      const token = generateAccessToken({ username: req.body.email });
      return res.json({ data: userLogin[0], token });
    } else {
      errorMessage(res);
    }
  },
  getProfileController: (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (err) return res.sendStatus(403);
      return res.send({ data: user });
    });
  },
};
