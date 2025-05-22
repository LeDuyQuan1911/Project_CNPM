const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');

const RankingSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  won: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goal_difference: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  rank: { type: Number, default: 0 }
}, { timestamps: true });

RankingSchema.plugin(mongo_delete, { overrideMethods: 'all', deletedAt: true });

const Ranking = mongoose.model('Ranking', RankingSchema);
module.exports = Ranking;
