const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = decoded; // You now have access to the payload
    next();
  });
}

module.exports = jwtMiddleware;
