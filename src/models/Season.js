import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const seasonSchema = new Schema({
  seasonName: String,
  seasonNumber: {type: Number, required: true, default: 1},
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
  },
  tournaments: [{
    type: Schema.Types.ObjectId,
    ref: 'Tournament'
  }],

});

seasonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

seasonSchema.plugin(uniqueValidator)

const Season = model('Season', seasonSchema)

export default Season