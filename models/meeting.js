const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    meetingName: { type: String, required: true }, 
    meetingImg: { type: String },
    meetingDescription: { type: String, required: true },
    meetingLanguage: { type: String, required: true },
    meetingDate: { type: String, required: true },
    meetingPoint: { type: String, required: true },
    meetingCity: { type: String, required: true },
    meetingOrganizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    meetingParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentArray: [{ type: Schema.Types.ObjectId, ref: 'Comment'  }]
 });

meetingSchema.set('timestamps', true);

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;