import databases from "../databases";
import connection from "../databases/connection";

function startConnection() {
  connection().connect(error => {
    error
      ? console.log(error)
      : console.log("Congrats you are connect to mysql database");
  });
}
export default {
  startConnection,
  insertUsersController: function (req, res) {
    connection().query(
      `INSERT INTO users (email, password, email_verified_at) VALUES ( '${
        req.body.email
      }' , '${req.body.password}' , '${new Date()}')`,
      (error, rows) => {
        error ? console.log(error) : res.send(rows);
      }
    );
  },
  getUsersController: function (req, res) {
    connection().query(`SELECT * FROM users`, (error, rows) => {
      res.send({ data: rows });
    });
  },
  getProductLocals: function (req, res) {
    res.send({ products: databases.product });
  },
};
