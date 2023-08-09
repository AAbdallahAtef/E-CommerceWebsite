const mysql = require("mysql");
const connect = require("../Routes/Authentication");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "e-commerce website db",
    port: "3306",
});

connection.connect((error) => {
    if (error) throw error;
    console.log("DB Connected");
})

module.exports = connection;