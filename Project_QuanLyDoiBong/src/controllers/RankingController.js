// controllers/RankingController.js

const Match = require('../models/MatchModel');
const Team = require('../models/TeamModel');

const calculateRanking = async (req, res, next) => {
  try {
    // 1. Lấy tất cả mùa giải hiện có
    const seasons = await Match.distinct('season');

    if (!seasons || seasons.length === 0) {
      return res.render('rankingAdmin', {
        title: "Bảng xếp hạng",
        rankings: [],
        seasons: [],
        selectedSeason: ''
      });
    }

    // 2. Xác định mùa giải được chọn
    let season = req.query.season;

    // Nếu không chọn thì mặc định chọn mùa mới nhất (sắp xếp theo chữ cái)
    if (!season) {
      seasons.sort(); // Sắp xếp tăng dần
      season = seasons[seasons.length - 1]; // Lấy mùa cuối (mới nhất)
    }

    // 3. Lọc các trận đấu theo mùa giải đã chọn
    const matches = await Match.find({
      season: season,
      'result.home_goals': { $ne: null },
      'result.away_goals': { $ne: null }
    }).populate('home_team_id away_team_id')
      .sort({ match_date: 1 });

    const teamStats = {};

    matches.forEach(match => {
      const homeId = match.home_team_id._id.toString();
      const awayId = match.away_team_id._id.toString();
      const homeGoals = match.result.home_goals;
      const awayGoals = match.result.away_goals;

      if (!teamStats[homeId]) {
        teamStats[homeId] = { team: match.home_team_id, played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, points: 0 };
      }
      if (!teamStats[awayId]) {
        teamStats[awayId] = { team: match.away_team_id, played: 0, win: 0, draw: 0, lose: 0, goals_for: 0, goals_against: 0, points: 0 };
      }

      teamStats[homeId].played++;
      teamStats[awayId].played++;

      teamStats[homeId].goals_for += homeGoals;
      teamStats[homeId].goals_against += awayGoals;

      teamStats[awayId].goals_for += awayGoals;
      teamStats[awayId].goals_against += homeGoals;

      if (homeGoals > awayGoals) {
        teamStats[homeId].win++;
        teamStats[homeId].points += 3;
        teamStats[awayId].lose++;
      } else if (homeGoals < awayGoals) {
        teamStats[awayId].win++;
        teamStats[awayId].points += 3;
        teamStats[homeId].lose++;
      } else {
        teamStats[homeId].draw++;
        teamStats[awayId].draw++;
        teamStats[homeId].points += 1;
        teamStats[awayId].points += 1;
      }
    });

    const rankings = Object.values(teamStats);

    rankings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goals_for - a.goals_against;
      const goalDiffB = b.goals_for - b.goals_against;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goals_for - a.goals_for;
    });

    // 4. Render
    return res.render('rankingAdmin', {
      title: "Bảng xếp hạng",
      rankings,
      seasons,
      selectedSeason: season
    });

  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Lỗi server khi tính bảng xếp hạng", 500));
  }
};

module.exports = { calculateRanking };
