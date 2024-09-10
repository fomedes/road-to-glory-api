import bcrypt from 'bcrypt';
import Community from "../models/Community.js";
import Season from '../models/Season.js';
import Team from "../models/Team.js";
import newsService from '../services/newsService.js';


const createCommunity = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
    const communityData = req.body

    const newSeason = new Season();

    const firstSeason = await newSeason.save();

    const newCommunity = new Community({
      // Community Bio
      id: communityData.id,
      name: communityData.name,
      isPrivate: communityData.isPrivate,
      password: hashedPassword,
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
      seasons: [firstSeason.id],
      currentSeason: firstSeason.id,
      news: communityData.news
  });
      await newCommunity.save();
      res.status(201).json(newCommunity);
  } catch (error) {
  res.status(400).json({ error: error.message });
  }
}

const getCommunityData = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
    .populate('currentSeason')
    .populate({
      path: 'teams',
      select: 'budget clubCrest clubName id'
    })
    .populate({
      path: 'tournaments',
      select: 'name'
    })
    .exec();
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving community data' });
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

const getCommunityTeams = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    const registeredTeams = community.teams;
    const communityTeams = await Team.find({ _id: { $in: registeredTeams } });
    res.json(communityTeams);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving registered teams' });
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

const getCommunityAccess = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // const user = await User.findById(req.params.userId);

    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    const passwordMatch = await bcrypt.compare(req.body.password, community.password);

    if (!passwordMatch) {
      return res.status(200).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Password is correct' });
  } catch (error) {
    res.status(500).json({ error: 'Error joining community' });
  }
}

const advanceSeason = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const seasonToEnd = await Season.findById(community.currentSeason)

    if (!seasonToEnd) {
      seasonToEnd.endDate = new Date();
      await seasonToEnd.save();
    }

    const newSeason = new Season({
      seasonNumber: (seasonToEnd.seasonNumber + 1),
      communityId: community.id
    });

    const advancedSeason = await newSeason.save();

    community.seasons.push(advancedSeason.id);
    community.currentSeason = advancedSeason.id;

    const newsData = {
      seasonNumber: advancedSeason.seasonNumber,
      communityId: community.id,
      type: 'newSeason'
    }

    await newsService.createNews(newsData);
    await community.save();

    res.status(200).json({ 
      message: 'Success',
      community: community
    });
  } catch (error) {
    res.status(500).json({ error: 'Error advancing season' });
  }
}

export default {
  getCommunityAccess, 
  createCommunity, 
  getCommunityData, 
  getAllCommunities, 
  getUserCommunities, 
  getCommunityTeams, 
  getRegisteredPlayers, 
  getMarketConfig, 
  advanceSeason
}
