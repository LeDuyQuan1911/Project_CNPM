const express = require('express');
const routerAPI = express.Router();
const User = require("../models/UserModel"); 
const { data } = require('autoprefixer');
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require('../utils/ErrorHandler');
const Team = require('../models/TeamModel');
const Player = require('../models/PlayerModel');
// Admin

const createUser = async (req,res) =>{
    const {username, password, email, phone_number, role} = req.body;
    const result = await User.create({username, password, email, phone_number, role});
    res.status(200).json(
        {data: result, message: "User created successfully", status: true}
    );
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
        return res.render("login", { title: "Login", error: "Invalid username or password" });
    }

    sendToken(user, 200, res); 

    if (user.role === 'admin') {
        return res.redirect('/admin');
    } else if (user.role === 'user') {
        return res.redirect('/user');
    } else {
        return res.status(403).send("Invalid role");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.render('admin', {
            title: 'Admin Dashboard',
            users: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


// User
const createTeam = async (req, res, next) => {
    try {
        const { team_name, players } = req.body;

        // 1. Validate đầu vào
        if (!team_name || !players || players.length === 0) {
            return res.render('createTeam', { 
                title: "Đăng ký đội bóng", 
                error: "Vui lòng nhập tên đội bóng và chọn ít nhất 1 cầu thủ.", 
                success: null, 
                playersList: await Player.find({})
            });
        }

        // Nếu chỉ chọn 5 cầu thủ thì kiểm tra luôn:
        if (players.length !== 5) {
            return res.render('createTeam', {
                title: "Đăng ký đội bóng",
                error: "Bạn phải chọn đúng 5 cầu thủ cho đội bóng.",
                success: null,
                playersList: await Player.find({})
            });
        }

        // 2. Check xem các cầu thủ đã thuộc team khác chưa
        const existingPlayers = await Player.find({ 
            _id: { $in: players }, 
            team: { $ne: null } // đã có team
        });

        if (existingPlayers.length > 0) {
            return res.render('createTeam', {
                title: "Đăng ký đội bóng",
                error: "Có cầu thủ đã thuộc đội khác. Vui lòng chọn lại!",
                success: null,
                playersList: await Player.find({})
            });
        }

        // 3. Tạo đội bóng mới
        const newTeam = await Team.create({
            team_name,
            players,
            createdBy: req.user._id, // từ middleware isAuthenticated
            status: 'pending'
        });

        // 4. Update Player: gán team cho các cầu thủ
        await Player.updateMany(
            { _id: { $in: players } },
            { $set: { team: newTeam._id } }
        );

        // 5. Trả về view thành công
        return res.render('createTeam', { 
            title: "Đăng ký đội bóng", 
            success: "Đăng ký đội bóng thành công, đang chờ admin duyệt.", 
            error: null, 
            playersList: await Player.find({})
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Lỗi server khi tạo đội bóng", 500));
    }
};




module.exports = {
    createUser,loginUser,getAllUsers, createTeam
}