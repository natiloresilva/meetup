const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true }, 
  password: { type: String, required: true},
  city: { type: String },
  country: { type: String },
  biography: { type: String }, 
  profileImage: { type: String }, 
  languagesISpeak: { type: String },
  iWantToLearn: { type: String },
  myPendingMeetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "meetingSchema"}],
  myOrganizedMeetings: [{  type: mongoose.Schema.Types.ObjectId, ref: "meetingSchema"}]
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
