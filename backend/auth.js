import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // The JWT_SECRET should be in your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload (the payload is the decoded object itself)
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  next();
}