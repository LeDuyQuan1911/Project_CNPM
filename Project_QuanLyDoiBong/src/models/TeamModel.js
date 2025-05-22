const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');

const TeamSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
  ],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

// Plugin soft delete
TeamSchema.plugin(mongo_delete, { overrideMethods: 'all', deletedAt: true });

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
