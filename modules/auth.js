const btoa = require("btoa");

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "Not alowed" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (req.method === "POST" && token > 0 && token < 11) {
    return next();
  }
  const idParam = req.params.id;
  const payload = btoa(idParam);
  if (payload === token) {
    return next();
  }
  return res.status(403).json({ message: "Not alowed" });
};
