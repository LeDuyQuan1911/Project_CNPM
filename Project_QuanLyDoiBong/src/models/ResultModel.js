const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');

const ResultSchema = new mongoose.Schema({
  home_goals: { type: Number, required: true },
  away_goals: { type: Number, required: true },
}, { timestamps: true });

ResultSchema.plugin(mongo_delete, { overrideMethods: 'all', deletedAt: true });

const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;
