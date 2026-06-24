import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    // Check if the authorization header is present and starts with 'Bearer '
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Validate token and decode payload to attach user info to request object
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
      if (err) {
        return res.status(403).json({ error: 'Session expired or token authentication failed' });
      }

      req.user = decodedPayload;
    
      next();
    });
    
  } catch (error) {
    console.error('Exception found within auth middleware:', error.message);
    return res.status(500).json({ error: 'Authentication engine intercept error' });
  }
};