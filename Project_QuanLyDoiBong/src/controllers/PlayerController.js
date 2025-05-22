// controllers/PlayerController.js

const Player = require('../models/PlayerModel');
const ErrorHandler = require('../utils/ErrorHandler');


const getPlayer = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalPlayers = await Player.countDocuments();
        const totalPages = Math.ceil(totalPlayers / limit);

        // Tìm players + populate team
        const players = await Player.find({})
            .populate('team') 
            .skip(skip)
            .limit(limit);

        console.log(players);

        return res.render('player', {
            title: "Danh sách cầu thủ",
            players,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi lấy danh sách cầu thủ", 500));
    }
};

const searchPlayer = async (req, res, next) => {
    try {
        const keyword = req.query.keyword || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Đếm tổng số player matching
        const totalPlayers = await Player.countDocuments({
            $or: [
                { player_name: { $regex: keyword, $options: 'i' } },
                { player_type: { $regex: keyword, $options: 'i' } }
            ]
        });

        const totalPages = Math.ceil(totalPlayers / limit);

        // Lấy player có phân trang
        const players = await Player.find({
            $or: [
                { player_name: { $regex: keyword, $options: 'i' } },
                { player_type: { $regex: keyword, $options: 'i' } }
            ]
        })
        .skip(skip)
        .limit(limit);

        return res.render('player', {
            title: "Kết quả tìm kiếm",
            players,
            currentPage: page,
            totalPages,
            keyword  // gửi kèm keyword để giữ lại khi bấm phân trang
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi tìm kiếm cầu thủ", 500));
    }
};


// API: Tạo 1 cầu thủ mới
const createPlayer = async (req, res, next) => {
    try {
        const { player_name, player_type, goals } = req.body;

        // 1. Validate đầu vào
        if (!player_name || !player_type) {
            return res.render('createPlayer', { title: "Tạo cầu thủ", error: "Vui lòng nhập đầy đủ tên cầu thủ và vị trí." });
        }

        // 2. Tạo cầu thủ
        await Player.create({
            player_name,
            player_type,
            goals: goals || 0
        });

        // 3. Render lại trang với thông báo thành công
        return res.render('createPlayer', { title: "Tạo cầu thủ", success: "Thêm cầu thủ thành công!" });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi tạo cầu thủ", 500));
    }
};

module.exports = { createPlayer, getPlayer, searchPlayer  };
