import Team from '../models/Team.js';
import User from '../models/User.js';
import communityService from '../services/communityService.js';
import userService from '../services/userService.js';

const createTeam = async (req, res) => {
  try {
    const teamData = req.body;
    const newTeam = new Team({
      clubId: teamData.club_id,
      clubName: teamData.club_name,
      clubCrest: teamData.club_crest,
      communityId: teamData.community_id,
      userId: teamData.user_id,
      budget: teamData.budget,
    });

    await newTeam.save();

    const userTeam = {
      teamId: newTeam._id,
      teamName: newTeam.clubName,
      teamCrest: newTeam.clubCrest,
      communityId: newTeam.communityId,
    }
    
    await userService.addTeamToUser(teamData.user_id, userTeam);
    await communityService.joinCommunity(newTeam.userId, newTeam.communityId);

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTeamByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const teams = user.teams;

  if (!teams || teams.length === 0) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(teams);
} catch (error) {
  res.status(500).json({ error: 'Error retrieving team data' });
}
};

export default { createTeam, getTeamByUserId };
