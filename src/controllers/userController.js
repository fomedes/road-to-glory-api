import User from "../models/User.js";

const register = async (req, res) => {
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
}

const findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const usernames = await User.find({}, 'username');

    if (usernames.length === 0) {
      return res.status(404).json({ error: 'No usernames found' });
    }

    res.json(usernames);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving usernames' });
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export default {register, findUser, getAllUsers, updateUser};