import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed: email not registered' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: `Authentication failed: wrong password entered` });
    }

    // Generate an access token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Respond with the access token
    res.json({ username:user.username ,userId: user.id, accessToken: token });
    
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ error: 'Error during authentication' });
  }
}

export default {login}
