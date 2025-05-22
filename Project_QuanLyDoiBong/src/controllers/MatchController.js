// controllers/MatchController.js

const Match = require('../models/MatchModel');
const Player = require('../models/PlayerModel');
const Team = require('../models/TeamModel');
const ErrorHandler = require('../utils/ErrorHandler');


const updateGoalsForPlayers = async () => {
  try {
    // Reset số bàn thắng về 0 trước
    await Player.updateMany({}, { $set: { goals: 0 } });

    // Lấy tất cả trận đấu
    const matches = await Match.find({}).populate('goals.player_id');

    const playerGoalsCount = {};

    // Tính tổng số bàn từng cầu thủ ghi được
    matches.forEach(match => {
      match.goals.forEach(goal => {
        const playerId = goal.player_id?._id?.toString();
        if (playerId) {
          playerGoalsCount[playerId] = (playerGoalsCount[playerId] || 0) + 1;
        }
      });
    });

    // Cập nhật số bàn thắng thực sự
    const updatePromises = Object.entries(playerGoalsCount).map(([playerId, goals]) => {
      return Player.findByIdAndUpdate(playerId, { goals: goals });
    });

    await Promise.all(updatePromises);

  } catch (error) {
    console.error('Lỗi khi cập nhật goals:', error);
  }
};

// Hàm tạo lịch thi đấu
const generateMatchSchedule = async (req, res, next) => {
    try {
        const { teams, season } = req.body; // Lấy danh sách đội từ client gửi lên

        if (!teams || teams.length < 2) {
            return next(new ErrorHandler("Phải chọn ít nhất 2 đội để tổ chức thi đấu.", 400));
        }

        const matches = [];

        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const isHomeFirst = Math.random() < 0.5;

                const homeTeam = isHomeFirst ? teams[i] : teams[j];
                const awayTeam = isHomeFirst ? teams[j] : teams[i];

                const matchDate = new Date();
                matchDate.setDate(matchDate.getDate() + matches.length + 1);

                // Lượt đi
                matches.push({
                    home_team_id: homeTeam,
                    away_team_id: awayTeam,
                    match_date: matchDate,
                    result: { home_goals: null, away_goals: null },
                    season: season // <<< Thêm mùa giải vào lịch thi đấu
                });

                // Lượt về
                const returnMatchDate = new Date(matchDate);
                returnMatchDate.setDate(returnMatchDate.getDate() + teams.length);

                matches.push({
                    home_team_id: awayTeam,
                    away_team_id: homeTeam,
                    match_date: returnMatchDate,
                    result: { home_goals: null, away_goals: null },
                    season: season // <<< Thêm mùa giải vào lịch thi đấu
                });
            }
        }

        await Match.insertMany(matches);

        res.status(201).json({
            success: true,
            message: "Đã tạo lịch thi đấu thành công!",
            total_matches: matches.length
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi tạo lịch thi đấu", 500));
    }
};

const getMatchList = async (req, res, next) => {
    try {
      const { season } = req.query;
  
      let query = {};
      if (season) {
        query.season = season;
      }
  
      const matches = await Match.find(query)
        .populate('home_team_id', 'team_name')
        .populate('away_team_id', 'team_name')
        .sort({ match_date: 1 });
  
      // Lấy tất cả các mùa giải (unique)
      const seasons = await Match.distinct('season');
      const teams = await Team.find({ status: 'approved' }); // <<< lấy danh sách đội bóng luôn

      res.render('matchAdmin', {
        title: "Danh sách trận đấu",
        matches,
        seasons, // <<< gửi tất cả mùa giải xuống EJS để đổ dropdown
        selectedSeason: season || '',
        teams
      });
  
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Lỗi server khi lấy danh sách trận đấu", 500));
    }
  };

  const deleteMatch = async (req, res, next) => {
    try {
      const { matchId } = req.params;
      await Match.findByIdAndDelete(matchId);
      res.json({ success: true, message: "Xóa trận đấu thành công" });
    } catch (error) {
      console.error(error);
      next(new ErrorHandler("Lỗi khi xóa trận đấu", 500));
    }
  };
  
  const updateMatchDate = async (req, res, next) => {
    try {
      const { matchId } = req.params;
      const { match_date } = req.body;
  
      await Match.findByIdAndUpdate(matchId, { match_date });
  
      res.json({ success: true, message: "Cập nhật ngày thi đấu thành công" });
    } catch (error) {
      console.error(error);
      next(new ErrorHandler("Lỗi khi cập nhật ngày thi đấu", 500));
    }
  };


  const getEditMatchDetail = async (req, res, next) => {
    try {
      const matchId = req.params.id;
      const match = await Match.findById(matchId)
        .populate('home_team_id')
        .populate('away_team_id')
        .populate('goals.player_id')
        .populate('goals.team_id');
  
      const players = await Player.find({});
  
      if (!match) {
        return next(new ErrorHandler("Không tìm thấy trận đấu!", 404));
      }
  
      return res.render('editMatchDetailAdmin', { title: "Cập nhật chi tiết trận đấu", match, players });
  
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Lỗi server khi lấy thông tin trận đấu", 500));
    }
  };
  
  // Xử lý cập nhật chi tiết trận đấu
  const updateMatchDetail = async (req, res, next) => {
    try {
      const { match_date, stadium, goals } = req.body;
      const matchId = req.params.id;
  
      const formattedGoals = goals.map(goal => ({
        player_id: goal.player_id,
        team_id: goal.team_id,
        goal_type: goal.goal_type,
        minute: goal.minute
      }));
  
      const updatedMatch = await Match.findByIdAndUpdate(matchId, {
        match_date,
        stadium,
        goals: formattedGoals
      }, { new: true });
  
      if (!updatedMatch) {
        return next(new ErrorHandler("Không tìm thấy trận đấu!", 404));
      }
  
      // ✅ Cập nhật lại bảng Player sau khi sửa goals
      await updateGoalsForPlayers();
  
      return res.status(200).json({ success: true, message: "Cập nhật chi tiết trận đấu thành công!" });
  
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Lỗi server khi cập nhật chi tiết trận đấu", 500));
    }
  };
  
  

  const updateMatchScore = async (req, res, next) => {
    try {
      const { matchId } = req.params;
      const { home_goals, away_goals } = req.body;
  
      // Kiểm tra dữ liệu đầu vào
      if (home_goals == null || away_goals == null) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin tỉ số.' });
      }
  
      // Tìm và cập nhật tỉ số trận đấu
      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        { 
          $set: { 
            'result.home_goals': home_goals,
            'result.away_goals': away_goals
          } 
        },
        { new: true } // Trả về bản ghi đã update
      );
  
      if (!updatedMatch) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy trận đấu.' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Cập nhật tỉ số thành công!',
        data: updatedMatch
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật tỉ số.' });
    }
  };
  

  

module.exports = { generateMatchSchedule, getMatchList, deleteMatch, updateMatchDate, getEditMatchDetail, updateMatchDetail, updateMatchScore };
