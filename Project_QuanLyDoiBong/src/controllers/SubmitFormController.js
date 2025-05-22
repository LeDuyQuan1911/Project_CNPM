// controllers/RegistrationController.js

const Team = require("../models/TeamModel");
const ErrorHandler = require("../utils/ErrorHandler");

const submitRegistration = async (req, res, next) => {
    try {
        const { team_name, players } = req.body;

        // 1. Validate dữ liệu form
        if (!team_name || !players || !Array.isArray(players) || players.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Hồ sơ không hợp lệ. Vui lòng bổ sung hoặc sửa hồ sơ. (Tối thiểu 5 cầu thủ)"
            });
        }

        // 2. Lấy user ID từ req.user (đã xác thực qua token JWT)
        const userId = req.user._id;

        // 3. Tạo Team mới
        const newTeam = await Team.create({
            team_name,
            players,
            createdBy: userId,
            status: 'pending' // Mặc định trạng thái chờ duyệt
        });

        // 4. Trả kết quả
        return res.status(201).json({
            success: true,
            message: "Đăng ký đội bóng thành công! Hồ sơ đang chờ xét duyệt.",
            data: newTeam
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Internal Server Error", 500));
    }
};

module.exports = { submitRegistration };
