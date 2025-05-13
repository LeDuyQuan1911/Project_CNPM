const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');

const PlayerSchema = new mongoose.Schema({
  player_name: { type: String, required: true },
  player_type: { type: String, required: true },
  goals: { type: Number, default: 0 },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null }
}, { timestamps: true });

PlayerSchema.plugin(mongo_delete, { overrideMethods: 'all', deletedAt: true });

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
