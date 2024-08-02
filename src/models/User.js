import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const teamsSchema = new Schema({
  teamId : {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  teamName: String,
  teamCrest: String,
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community'
  }
}, { _id: false })


const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email:{
    type: String,
    unique: true
  },
  password: String,
  teams: [teamsSchema],
  country: String,
  platform: String,
  language: String,
  accountLevel: Number,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id

    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.password
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

export default User