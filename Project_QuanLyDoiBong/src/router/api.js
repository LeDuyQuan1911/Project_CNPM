const express = require('express'); // import express
const routerAPI = express.Router();

const { expressjwt: jwt } = require("express-jwt");
const { createUser,loginUser, getAllUsers, createTeam } = require("../controllers/UserController"); // import user model
const { data } = require('autoprefixer');
const SECRET_KEY = "q3r#7sG!8fL09p*7h";
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware"); // import auth middleware
const { submitRegistration } = require('../controllers/SubmitFormController');
const { createPlayer, getPlayer, searchPlayer } = require('../controllers/PlayerController');
const Player = require('../models/PlayerModel');
const { getAllTeams, updateTeamStatus } = require('../controllers/TeamController');
const { getMatchList, generateMatchSchedule, deleteMatch, updateMatchDate, getEditMatchDetail, updateMatchDetail, updateMatchScore } = require('../controllers/MatchController');
const { calculateRanking } = require('../controllers/RankingController');
const apiRoutes = (app) => { 

    //Page
    app.get("/login",(req,res)=>{
        res.render("login", {title: "Login"});
    })
    app.get("/user",( req, res) => {
        res.render("user", {title: "User"});
    })
    app.get('/admin/createPlayer', isAuthenticated, isAdmin("admin"), (req, res) => {
        res.render("createPlayer", {title: "Create Player",success: null, error: null});
    })
    app.get('/admin/teamAdmin', isAuthenticated, isAdmin("admin"), getAllTeams)
    app.get('/admin/player', isAuthenticated, isAdmin("admin"),getPlayer);
    app.get('/admin/player/search', isAuthenticated, isAdmin("admin"), searchPlayer);
    app.get('/admin/match', isAuthenticated, isAdmin("admin"), getMatchList);



    // Người dùng submit form
    app.post('/register-team', isAuthenticated, submitRegistration);
    
    // User
    app.post("/login",loginUser);
    app.get("/user/createTeam",isAuthenticated, async (req, res) => {
        const playersList = await Player.find({});
        res.render('createTeam', { title: 'Đăng ký đội bóng', playersList, success: null, error: null });
    })
    app.post("/user/createTeam",isAuthenticated,createTeam)


    //Admin
    app.get("/admin",isAuthenticated,isAdmin("admin"), getAllUsers) // Lấy thông tin tất cả người dùng
    app.post("/admin",createUser); // Tạo nguời dùng mới
    app.post("/player",isAuthenticated,isAdmin("admin"),createPlayer); // Tạo cầu thủ mới
    app.get("/player",isAuthenticated,isAdmin("admin"),getPlayer); // Lấy thông tin tất cả cầu thủ
    app.patch('/admin/teamAdmin/:teamId', isAuthenticated, isAdmin("admin"), updateTeamStatus )
    app.post('/admin/match', isAuthenticated, isAdmin("admin"), generateMatchSchedule);
    app.delete('/admin/match/:matchId', isAuthenticated, isAdmin("admin"), deleteMatch);
    app.patch('/admin/match/:matchId', isAuthenticated, isAdmin("admin"), updateMatchDate);
    app.patch('/admin/match/:matchId/score', isAuthenticated, isAdmin('admin'), updateMatchScore);
    app.get('/admin/match/:id/edit-detail', isAuthenticated, isAdmin("admin"), getEditMatchDetail);
    app.patch('/admin/match/:id/edit-detail', isAuthenticated, isAdmin("admin"), updateMatchDetail);
    app.get('/admin/ranking', isAuthenticated, isAdmin("admin"), calculateRanking);

    app.use("/", routerAPI); 
}

module.exports = apiRoutes;