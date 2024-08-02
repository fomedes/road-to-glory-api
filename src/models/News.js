import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const newsSchema = new Schema({
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