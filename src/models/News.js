import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const newsSchema = new Schema({
  message: String,
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['newUser', 'newTournament', 'transferPurchase', 'transferSale']
  },

  // New Tournament details
  tournamentId: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament'
  },

  // Transfer details
  // transferDetails: TransferDetails,
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerName: String,
  buyerCrest: String,
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sellerName: String,
  sellerCrest: String,
  playerId: String,
  playerName: String,
  playerImage: String,
  transferAmount: Number,

  //New user details
  clubName: String,
  clubCrest: String,
  teamId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

newsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

newsSchema.plugin(uniqueValidator)

const News = model('News', newsSchema)

export default News