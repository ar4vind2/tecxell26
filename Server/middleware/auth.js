import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from header (e.g., "Bearer <token>")
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's info (from the token payload) to the request object
    req.user = decoded; 
    
    next(); // Move on to the next middleware or the route handler
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;