import Community from "../models/Community.js";

const createCommunity = async (req, res) => {
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
}

const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving community data' });
  }
}

const getUserCommunities = async (req, res) => {
  try {
    const userCommunities = await Community.find({ users: req.params.userId });

    if (!userCommunities) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(userCommunities);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving community data' });
  }
}

const getRegisteredPlayers = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const registeredPlayers = community.registeredPlayers;
    res.json(registeredPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving registered players' });
  }
}

const getMarketConfig = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const marketConfig = community.market;
    res.json(marketConfig);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving market configuration' });
  }
}

export default {createCommunity, getAllCommunities, getUserCommunities, getRegisteredPlayers, getMarketConfig}
