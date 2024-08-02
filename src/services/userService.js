import User from '../models/User.js';

const addTeamToUser = async (userId, newTeam) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.teams.push(newTeam);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Failed to update user with team: ${error.message}`);
  }
};

export default { addTeamToUser };
