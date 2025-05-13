const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');

const MatchSchema = new mongoose.Schema({
    home_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    away_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    match_date: { type: Date, required: true },
    stadium: { type: String }, // sân thi đấu
    result: {
      home_goals: { type: Number, default: null },
      away_goals: { type: Number, default: null },
    },
    season: { type: String }, // mùa giải
  
    // Thêm chi tiết bàn thắng
    goals: [
      { 
        player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // cầu thủ ghi bàn
        team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },       // đội bóng ghi bàn
        goal_type: { type: String, enum: ['A', 'B', 'C'], required: true },   // loại bàn thắng
        minute: { type: Number, min: 0, max: 120, required: true }            // thời điểm ghi bàn
      }
    ]
  
  }, { timestamps: true });

MatchSchema.plugin(mongo_delete, { overrideMethods: 'all' }, { deletedAt : true });
const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;