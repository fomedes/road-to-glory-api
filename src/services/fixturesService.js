import {
  RoundRobin
} from 'tournament-pairings';

const teams = ['Team A', 'TeamB', 'TeamC', 'TeamD', 'TeamE', 'TeamF', 'TeamG', 'TeamH'];

//placeholders
// const elimBracket = SingleElimination(teams, 1, true);
// const doubleElimBracket = DoubleElimination(teams, 1, true);
// const league = RoundRobin(teams);
// const steplr = Stepladder(teams, 1, true);
// const swissFictures = Swiss(teams, 1, true);

const createLeague = async (teams, numSplits, startingMatchday, ordered) => {
  const league = RoundRobin(teams, numSplits, startingMatchday, ordered);
  return league;
};

export default { createLeague };