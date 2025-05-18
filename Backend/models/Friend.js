const mongoose = require('../config/db');

const FriendSchema = new mongoose.Schema({
  sent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  received: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  accepted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Friend', FriendSchema);