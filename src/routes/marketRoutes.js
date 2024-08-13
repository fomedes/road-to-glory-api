import express from 'express';
import Community from '../models/Community.js';
import Team from '../models/Team.js';


const router = express.Router();

router.post('/bid', async (req, res) => {
  const bidDetails = req.body;

  try {
// Check budget, deduct cost and add Player to Team
    const buyerTeam = await Team.findById(bidDetails.teamId);
    if (!buyerTeam) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (buyerTeam.budget < bidDetails.bidAmount) {
      return res.status(400).json({ message: 'Insufficient budget' });
    }
    buyerTeam.players.push(bidDetails.playerId);
    buyerTeam.budget -= bidDetails.bidAmount;
    await buyerTeam.save();

// Add player to Community 
    const community = await Community.findById(bidDetails.communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const playerToAdd = {
        playerId: bidDetails.playerId,
        bidAmount: bidDetails.bidAmount,
        clubCrest: bidDetails.buyerCrest,
    }
    community.registeredPlayers.push(playerToAdd)
    await community.save();

    res.status(200).json({ message: 'Player purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to purchase player', error });
  }
 
});
export default router;
