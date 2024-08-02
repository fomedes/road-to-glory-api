import express from 'express';
import Community from '../models/Community.js';


const router = express.Router();

router.use(express.json());

router.post('/create',  async (req, res) => {
    try {
        
      const communityData = req.body
      const newCommunity = new Community({
        // Community Bio
        id: communityData.id,
        name: communityData.name,
        isPrivate: communityData.isPrivate,
        password: communityData.password,
        communityPlatforms: communityData.communityPlatforms,
        admins: communityData.admins,
        users: communityData.users,

        // Starting Conditions
        startingTeam: communityData.startingTeam,
        startingBudget: communityData.startingBudget,
        
        // Market Details
        market: {
            randomPlayers: communityData.market.randomPlayers,
            minOvr: communityData.market.minOvr,
            maxOvr: communityData.market.maxOvr,
            bidWindow: communityData.market.bidWindow,
            announceBid: communityData.market.announceBid,
            playerPrices: communityData.market.playerPrices,
        },

        // Competition Activity
        registeredClubs: communityData.registeredClubs,
        registeredPlayers: communityData.registeredPlayers,
        tournaments: communityData.tournaments,
        seasons: communityData.seasons,
        news: communityData.news
    });
        await newCommunity.save();
        res.status(201).json(newCommunity);
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
})

router.get('/userCommunities/:user_id', async (req, res) => {
    try {
        const userCommunities = await Community.find({ users: req.params.user_id });
        res.json(userCommunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/all', async (req, res) => {
    try {
        const communities = await Community.find();
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;
