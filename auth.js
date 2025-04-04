const jwt = require("jsonwebtoken");
const url = require("url");

function jwtMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;

  const authHeader = req.headers["authorization"];
  const tokenQueryParam = req.query.token;

  if (!authHeader && !tokenQueryParam) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let token;

  if (authHeader) {
    token = authHeader.split(" ")[1];
    console.info("--Basic Token", token);
  } else if (tokenQueryParam) {
    token = tokenQueryParam;
    console.info("--Presigned Token", token);

    // Remove only `token` query param
    const parsedUrl = url.parse(req.url, true);
    delete parsedUrl.query.token;
    delete parsedUrl.search; // force regeneration of query string
    req.url = url.format(parsedUrl);
    console.log('--req.url', req.url);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    next();
  });
}

module.exports = jwtMiddleware;
