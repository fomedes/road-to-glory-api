import Team from "../models/Team.js";
import newsService from "../services/newsService.js";

const adjustTeamBudget = async (req, res) => {

  try {
    const team = await Team.findById(req.body.teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (req.body.actionType === 'Bonus') {
      team.budget += req.body.amount;
    } else if (req.body.actionType === 'Penalization') {
      team.budget -= req.body.amount;

    } else {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    const newsData = {
      teamId: team.id,
      clubName: team.clubName,
      clubCrest: team.clubCrest,
      communityId: team.communityId,
      amount: req.body.amount,
      message: req.body.message,
      type: req.body.actionType.toLowerCase(),
    };

    await newsService.createNews(newsData);
    await team.save();
    

    res.status(200).json({
      message: `${req.body.actionType} successfully applied to team ${team.clubName}`,
      updatedBudget: team.budget,
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Error updating team budget' });
  }


}

export default {
    adjustTeamBudget
}