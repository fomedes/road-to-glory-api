import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const playerHistoricSchema = new Schema({
  playerId: { type: String, default: '' },
  gamesPlayed: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
}, { _id: false });

const historicSchema = new Schema({
  won: { type: Number, default: 0 },
  tied: { type: Number, default: 0 },
  lost: { type: Number, default: 0 }
}, { _id: false });


const teamSchema = new Schema({
  clubId: { type: String, required: true },
  clubName: { type: String, required: true },
  clubCrest: { type: String, required: true },
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  communityName: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  budget: { type: Number, required: true },
  players: [{ type: String }],
  favoritePlayers: [{ type: String }],
  trophies: [{
    type: Schema.Types.ObjectId,
    ref: 'Trophy'
  }],
  historic: historicSchema,
  playerHistoric: [playerHistoricSchema],
});

teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.set('toJSON', {
  virtuals: true, 
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

teamSchema.plugin(uniqueValidator);

const Team = model('Team', teamSchema);

export default Team;
