import Community from "../models/Community.js";
import Team from "../models/Team.js";
import newsService from "../services/newsService.js";

const bidPlayer = async (req, res) => {
  if (!req.body.playerId) {
    return res.status(404).json({ message: 'Player ID not found' });
  }

  try {
// Check budget, deduct cost and add Player to Team
    const buyerTeam = await Team.findById(req.body.buyerId);
    if (!buyerTeam) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (buyerTeam.budget < req.body.transferAmount) {
      return res.status(400).json({ message: 'Insufficient budget' });
    }
    buyerTeam.players.push(req.body.playerId);
    buyerTeam.budget -= req.body.transferAmount;

// Add player to Community 
    const community = await Community.findById(req.body.communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const playerToAdd = {
        playerId: req.body.playerId,
        transferAmount: req.body.transferAmount,
        clubCrest: req.body.buyerCrest,
    }
    community.registeredPlayers.push(playerToAdd)
    

    // // Create news
    await newsService.createNews(req.body);
    await buyerTeam.save();
    await community.save();


    res.status(200).json({ message: 'Player purchased successfully' });
  } catch (error) {
    console.error("Error during player purchase:", error); // Log the detailed error
    res.status(500).json({ message: 'Failed to purchase player', error: error.message });
  }
 
}

const releasePlayer = async (req, res) => {
    if (!req.body.playerId) {
        return res.status(404).json({ message: 'Player ID not found' });
    }

    try {
        const sellerTeam = await Team.findById(req.body.sellerId);
        if (!sellerTeam) {
            return res.status(404).json({ message: 'User not found' });
        }
        sellerTeam.players = sellerTeam.players.filter(playerId => playerId !== req.body.playerId);
        sellerTeam.budget += req.body.transferAmount;

        const community = await Community.findById(req.body.communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        community.registeredPlayers = community.registeredPlayers.filter(player => player.playerId !== req.body.playerId);

        await sellerTeam.save();
        await community.save();
    
        // Create news
        await newsService.createNews(req.body);

        res.status(200).json({ message: 'Player released successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to release player', error });
    }
}

export default {
    bidPlayer, releasePlayer
}