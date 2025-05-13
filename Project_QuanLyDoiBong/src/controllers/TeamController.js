// controllers/TeamController.js

const Team = require('../models/TeamModel');
const Player = require('../models/PlayerModel');
const ErrorHandler = require('../utils/ErrorHandler');

const getAllTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({})
            .populate('players', 'player_name') // Lấy tên cầu thủ
            .populate('createdBy', 'username'); // Lấy tên người tạo

        return res.render('teamAdmin', { 
            title: "Danh sách đội bóng", 
            teams 
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi lấy danh sách đội bóng", 500));
    }
};

const updateTeamStatus = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ." });
        }

        // Tìm team
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đội bóng." });
        }

        // Update status
        team.status = status;
        await team.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái đội bóng thành công!",
            team
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi cập nhật trạng thái đội bóng", 500));
    }
};

module.exports = { getAllTeams, updateTeamStatus };
