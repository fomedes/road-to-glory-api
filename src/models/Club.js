import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const clubSchema = new Schema({
  name: String,
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  },
  clubs: {
    type: Schema.Types.ObjectId,
    ref: 'Club'
  },

});

clubSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

clubSchema.plugin(uniqueValidator)

const Club = model('Club', clubSchema)

export default Club