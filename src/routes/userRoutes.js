import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/User.js';


const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, country, platform } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,    
      password: hashedPassword,
      country, 
      platform,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/find/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    // Query the database to find the user by their id
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user data' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const usernames = await User.find({}, 'username');

    if (usernames.length === 0) {
      return res.status(404).json({ error: 'No usernames found' });
    }

    res.json(usernames);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving usernames' });
  }
});

router.patch('/update/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found:', user_id); // Log details for debugging
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
