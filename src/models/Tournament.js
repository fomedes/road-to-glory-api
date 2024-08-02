import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const standingsLeagueSchema = new Schema({
  teamID: { type: Number, default: 0 },
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
  playerID: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
}, { _id: false });

const matchSchema = new Schema({
  teams: {
    home: { type: String, required: true },
    away: { type: String, required: true }
  },
  matchday:  Number,
  // date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  goals: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  }
}, { _id: false });

const tournamentSchema = new Schema({
  name: { type: String, required: true },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  isFinished: { type: Boolean, default: false },
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
  matches: [matchSchema],
  endDate: Date,
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
