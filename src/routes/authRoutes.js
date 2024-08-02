import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
  next();
});

export default router;