const conn = require("../Db/DbConnection");
const util = require("util"); // helper

const authorized = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const customer = await query("select * from customer where token = ?", [token]);
  if (customer[0]) {
    res.locals.customer = customer[0];
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = authorized;