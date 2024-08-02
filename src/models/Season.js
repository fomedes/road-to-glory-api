import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const seasonSchema = new Schema({
  name: String,
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
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