import { Schema, model } from 'mongoose';

const transferDetailsSchema = new Schema({
  transferType: {
    type: String,
    enum: ['buy', 'sell']
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  transferAmount: Number,
}, { _id: false });

transferDetailsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const TransferDetails = model('TransferDetails', transferDetailsSchema)

export { TransferDetails };

