import Community from "../models/Community.js";
import Match from "../models/Match.js";
import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";
import fixturesService from "../services/fixturesService.js";
import newsService from "../services/newsService.js";

const team = Team

const createTournament = async (req, res) => {
  const session = await Tournament.startSession();
  session.startTransaction();

  try {
    const { name, communityId, tournamentType, teams, numSplits, startingMatchday, ordered } = req.body;
    const startDate = new Date();

    const community = await Community.findById(communityId).session(session);
    if (!community) {
      console.error('Community not found');
      return res.status(404).json({ error: 'Community not found' });
    }

    // Create fixtures
    const leagueFixtures = await fixturesService.createLeague(teams, numSplits, startingMatchday, ordered);

    // Insert matches in bulk
    const newMatches = await Match.insertMany(leagueFixtures, { session });
    const matches = newMatches.map(match => match._id);

    // Create tournament
    const newTournament = await new Tournament({
      name,
      communityId,
      tournamentType,
      startDate,
      teams,
      matches
    }).save({ session });

    
    community.tournaments.push(newTournament._id);
    await community.save({ session });

    // Create news
    const newsData = {
      name: newTournament.name,
      communityId: newTournament.communityId,
      tournamentId: newTournament._id,
      type: 'newTournament',
    };
    newsService.createNews(newsData, session);

    
    await session.commitTransaction();

    res.status(201).json(newTournament);
  } catch (error) {
    console.error('Transaction error:', error);
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};



const getTournamentDetails = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;

    const tournament = await Tournament.findById(tournamentId)
    .populate({
      path: 'matches',
      model: 'Match',
      populate: {
        path: 'home away',
        model: 'Team',
        select: 'clubName clubCrest id _id',
      }
    })
    .exec();
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {createTournament, getTournamentDetails}