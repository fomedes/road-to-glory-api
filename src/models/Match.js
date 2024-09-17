import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const playerStatsSchema = new Schema({
  playerId: { type: String, required: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  injuries: { type: Number, default: 0 },
}, { _id: false });

const matchStatsSchema = new Schema({
  home: {  
    goals: { type: Number, default: null },
    possession: { type: Number, default: 0 },
    ballRecovery: { type: Number, default: 0 },
    shots: { type: Number, default: 0 },
    expectedGoals: { type: Number, default: 0 },
    passes: { type: Number, default: 0 },
    tackles: { type: Number, default: 0 },
    tacklesWon: { type: Number, default: 0 },
    interceptions: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    foulsCommitted: { type: Number, default: 0 },
    offsides: { type: Number, default: 0 },
    corners: { type: Number, default: 0 },
    freeKicks: { type: Number, default: 0 },
    penaltyKicks: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    injuries: { type: Number, default: 0 },
  },
  away: {  
    goals: { type: Number, default: null },
    possession: { type: Number, default: 0 },
    ballRecovery: { type: Number, default: 0 },
    shots: { type: Number, default: 0 },
    expectedGoals: { type: Number, default: 0 },
    passes: { type: Number, default: 0 },
    tackles: { type: Number, default: 0 },
    tacklesWon: { type: Number, default: 0 },
    interceptions: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    foulsCommitted: { type: Number, default: 0 },
    offsides: { type: Number, default: 0 },
    corners: { type: Number, default: 0 },
    freeKicks: { type: Number, default: 0 },
    penaltyKicks: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    injuries: { type: Number, default: 0 },
  }

}, { _id: false });

const matchSchema = new Schema({
  split: { type: Number, required: true },
  matchday:  { type: Number, required: true },
  match:  { type: Number, required: true },
  home: { 
    type: Schema.Types.ObjectId, 
    ref: 'Team' 
  },
  away: { 
    type: Schema.Types.ObjectId, 
    ref: 'Team' 
  },
  // date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  playerStats: [playerStatsSchema],
  matchStats: matchStatsSchema
});

matchSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

matchSchema.plugin(uniqueValidator);

const Match = model('Match', matchSchema);

export default Match;
