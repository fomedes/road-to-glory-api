import Match from "../models/Match.js";
import tournamentService from "../services/tournamentService.js";


const getMatchById = async (req, res) => {
  const matchId = req.params.matchId;
  const match = await Match.findById(matchId)
  .populate({
    path: 'home away',
    model: 'Team',
    select: 'clubName'
  })
  .exec();
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  res.status(200).json(match);
} 

const updateMatch = async (req, res) => {
  const matchId = req.params.matchId;
  const matchData = req.body;

  const session = await Match.startSession();
  session.startTransaction();

  try {
    const match = await Match.findById(matchId).session(session);
    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Match not found' });
    }


    if (match.home.valueOf() !== matchData.home || match.away.valueOf() !== matchData.away) {
      return res.status(404).json({ error: 'Teams not matching' });
    }

    match.matchStats = matchData.matchStats
    match.status = 'completed'

    const updatedStandings = await tournamentService.updateStandings(matchData, session);
    
    await match.save({ session });


    await session.commitTransaction();
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the match' });
  }
};
export default {getMatchById, updateMatch}