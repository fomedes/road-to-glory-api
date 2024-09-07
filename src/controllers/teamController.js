import Community from '../models/Community.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import communityService from '../services/communityService.js';
import newsService from '../services/newsService.js';
import userService from '../services/userService.js';

const createTeam = async (req, res) => {
  const team = req.body;
  try {
    const userInCommunity = await Community.findOne({
      _id: team.communityId,
      users: team.userId
    });

    if (userInCommunity) {
      return res.status(400).json({ error: 'User already exists in the community.' });
    }

    const newTeam = new Team({
      clubId: team.clubId,
      clubName: team.clubName,
      clubCrest: team.clubCrest,
      communityId: team.communityId,
      communityName: team.communityName,
      userId: team.userId,
      budget: team.budget,
    });

    const user = await User.findById(team.userId);

    const userTeam = {
      teamId: newTeam.id,
      clubName: newTeam.clubName,
      clubCrest: newTeam.clubCrest,
      communityId: newTeam.communityId,
      communityName: newTeam.communityName,
    }

    const newsData = {
      teamId: newTeam.id,
      username: user.username,
      communityId: newTeam.communityId,
      clubName: newTeam.clubName,
      clubCrest: newTeam.clubCrest,
      communityName: newTeam.communityName,
      type: 'newUser'
    }

    await newsService.createNews(newsData);
    
    const createdTeam = await newTeam.save();
    await userService.addTeamToUser(team.userId, userTeam);
    await communityService.joinCommunity(newTeam.userId, newTeam.communityId, createdTeam.id);

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving team data' });
  }
};

const getTeamByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
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

export default { createTeam, getTeamById, getTeamByUserId };
