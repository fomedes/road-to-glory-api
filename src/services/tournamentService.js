import Tournament from '../models/Tournament.js';
const updateStandings = async (matchData, session) => {

  try {
    const tournament = await Tournament.findById(matchData.tournamentId).session(session);
    

    const homeStanding = tournament.standingsLeague.find(
      (standing) => standing.team.toString() === matchData.home
    );

    const awayStanding = tournament.standingsLeague.find(
      (standing) => standing.team.toString() === matchData.away
    );

    if (!homeStanding || !awayStanding) {
      return res.status(404).json({ error: 'Team standings not found' });
    }
  
    const homeGoals = matchData.matchStats.home.goals;
    const awayGoals = matchData.matchStats.away.goals;
  
    homeStanding.gamesPlayed += 1;
    awayStanding.gamesPlayed += 1;
  
    if (homeGoals > awayGoals) {
      homeStanding.points += 3;
      homeStanding.won += 1;
      awayStanding.lost += 1;
  
      homeStanding.streak.push('W');
      awayStanding.streak.push('L');
    } else if (homeGoals < awayGoals) {
      awayStanding.points += 3;
      awayStanding.won += 1;
      homeStanding.lost += 1;
  
      awayStanding.streak.push('W');
      homeStanding.streak.push('L');
    } else {
      homeStanding.points += 1;
      awayStanding.points += 1;
      homeStanding.tied += 1;
      awayStanding.tied += 1;
  
      homeStanding.streak.push('T');
      awayStanding.streak.push('T');
    }
  
    homeStanding.goalsFor += homeGoals;
    homeStanding.goalsAgainst += awayGoals;
    homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
  
    awayStanding.goalsFor += awayGoals;
    awayStanding.goalsAgainst += homeGoals;
    awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;

    sortStandings(tournament.standingsLeague);

    await tournament.save({session});

    console.log('standings:', tournament.standingsLeague)

    return { message: 'Match result processed successfully', standings: tournament.standingsLeague };

  }
  catch (error) {
    console.error('Match Stats error:', error);
    throw new Error(error.message);
  }
};


const sortStandings = (standings) => {
  return standings.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else if (a.gamesPlayed !== b.gamesPlayed) {
      return a.gamesPlayed - b.gamesPlayed;
    } else if (a.won !== b.won) {
      return b.won - a.won;
    } else if (a.goalDifference !== b.goalDifference) {
      return b.goalsFor - a.goalsFor;
    } else if (a.goalsFor !== b.goalsFor) {
      return b.goalsFor - a.goalsFor;
    } else if (a.goalsAgainst !== b.goalsAgainst) {
      return b.goalsAgainst - a.goalsAgainst;
    } else {
      return 0;
    }
  });
};

export default{
  updateStandings
};

