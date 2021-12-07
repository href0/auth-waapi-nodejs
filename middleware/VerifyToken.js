import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decocded) => {
    if (err) return res.sendStatus(403);
    const type = decocded.type;
    if (type == "otp") return res.sendStatus(401);
    req.email = decocded.email;
    next();
  });
};
