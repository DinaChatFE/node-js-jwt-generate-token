import mysql from "mysql";

function connect() {
  return mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "node-js",
  });
}
export default connect;
