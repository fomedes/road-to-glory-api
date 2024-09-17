import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const standingsLeagueSchema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team'  },
  points: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  tied: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  streak: { type: [String], enum: ['W', 'T', 'L'], default: [] },
}, { _id: false });

const playerStatsSchema = new Schema({
  playerId: { type: String, default: '' },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
}, { _id: false });


const tournamentSchema = new Schema({
  name: { type: String, required: true },
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  income: {
    type: String,
    enum: ['byGame', 'byResult', 'byPlacement'],
    required: true,
    default: 'byGame'
  },
  tournamentType: {
    type: String,
    enum: ['league', 'singleElimination', 'doubleElimination'],
    required: true,
    default: 'league'
  },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  rewards: [{ type: Number }],
  standingsLeague: [standingsLeagueSchema],
  playerStats: [playerStatsSchema],
  matches: [ {type: Schema.Types.ObjectId, ref: 'Match'}],
  startDate: Date,
  endDate: Date,
  isFinished: { type: Boolean, default: false },
});

tournamentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

tournamentSchema.plugin(uniqueValidator);

const Tournament = model('Tournament', tournamentSchema);

export default Tournament;
