import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const newsSchema = new Schema({
  message: String,
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  tournamentId: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  clubCrest: String,
  type: { 
    type: String, 
    required: true, 
    enum: ['newUser', 'newTournament', 'transfer']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // transferDetails: TransferDetails,
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