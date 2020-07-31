const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'}, 
    event: { type: Schema.Types.ObjectId, ref: 'meetings'},
    comment: { type: String, required: true },
}, { timestamps:true });

const comments = mongoose.model('comments', commentsSchema);

module.exports = comments;