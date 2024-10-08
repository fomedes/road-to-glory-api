import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const playerPriceSchema = new Schema({
  ovr: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const registeredPlayers = new Schema({
  playerId: String,
  clubCrest: String,
  bidAmount: Number,
}, { _id: false });

const marketSchema = new Schema({
  playerDatabase: String,
  randomPlayers: { type: Boolean, required: true },
  minOvr: { 
    type: Number, 
    required: true, 
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    },
    min: [1, 'minOvr must be a natural number'] 
  }, 
  maxOvr: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    },
    max: [100, 'maxOvr must be a natural number']
  },
  bidWindow: { 
    type: String, 
    required: true, 
    enum: ['instant', '24', '48', '72'] 
  },
  announceBid: { 
    type: String, 
    required: true, 
    enum: ['none', 'player', 'amount', 'both'] 
  },
  playerPrices: [playerPriceSchema]
}, { _id: false });

const communitySchema = new Schema({
  // Community Bio
  name: String,
  isPrivate: { type: Boolean, default: false },
  password: {
    type: String,
    required: function() {
      return this.isPrivate;
    },
    validate: {
      validator: function(v) {
        if (this.isPrivate) {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Password is required when the community is private.'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],
  communityPlatforms: [String],
  maxUsers: {type: Number, default: 0},
  maxPlayers: {type: Number, default: 0},
  minPlayers: {type: Number, default: 0},


  // Starting Conditions
  startingTeam: String,
  startingBudget: Number,


  // Market Details
  market: marketSchema,

  // Competition Activity
  registeredClubs: [String],
  registeredPlayers: [registeredPlayers],
  tournaments: [{
    type: Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  currentSeason: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  seasons: [{
    type: Schema.Types.ObjectId,
    ref: 'Season'
  }],
  news: [{
    type: Schema.Types.ObjectId,
    ref: 'News'
  }],

});

communitySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

communitySchema.plugin(uniqueValidator)

const Community = model('Community', communitySchema)

export default Community