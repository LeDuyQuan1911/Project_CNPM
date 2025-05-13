/**
 * @swagger
 * /login:
 *   get:
 *     summary: Hiển thị trang đăng nhập
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Trang đăng nhập được hiển thị
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Hiển thị trang người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Trang người dùng được hiển thị
 */

/**
 * @swagger
 * /admin/createPlayer:
 *   get:
 *     summary: Hiển thị form tạo cầu thủ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hiển thị form tạo cầu thủ
 */

/**
 * @swagger
 * /admin/teamAdmin:
 *   get:
 *     summary: Lấy danh sách đội bóng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đội bóng
 */

/**
 * @swagger
 * /admin/player:
 *   get:
 *     summary: Lấy danh sách cầu thủ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách cầu thủ
 */

/**
 * @swagger
 * /admin/player/search:
 *   get:
 *     summary: Tìm kiếm cầu thủ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */

/**
 * @swagger
 * /admin/match:
 *   get:
 *     summary: Lấy danh sách trận đấu
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách trận đấu
 */

/**
 * @swagger
 * /register-team:
 *   post:
 *     summary: Người dùng gửi đơn đăng ký đội bóng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /user/createTeam:
 *   get:
 *     summary: Hiển thị form tạo đội bóng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hiển thị form tạo đội bóng
 */

/**
 * @swagger
 * /user/createTeam:
 *   post:
 *     summary: Tạo đội bóng mới
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tạo đội bóng thành công
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Lấy tất cả người dùng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 */

/**
 * @swagger
 * /player:
 *   post:
 *     summary: Tạo cầu thủ mới
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Tạo cầu thủ thành công
 */

/**
 * @swagger
 * /player:
 *   get:
 *     summary: Lấy danh sách cầu thủ
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách cầu thủ
 */

/**
 * @swagger
 * /admin/teamAdmin/{teamId}:
 *   patch:
 *     summary: Cập nhật trạng thái đội bóng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /admin/match:
 *   post:
 *     summary: Tạo lịch thi đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tạo lịch thi đấu thành công
 */

/**
 * @swagger
 * /admin/match/{matchId}:
 *   delete:
 *     summary: Xoá trận đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 */

/**
 * @swagger
 * /admin/match/{matchId}:
 *   patch:
 *     summary: Cập nhật ngày thi đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /admin/match/{matchId}/score:
 *   patch:
 *     summary: Cập nhật tỷ số trận đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật tỷ số thành công
 */

/**
 * @swagger
 * /admin/match/{id}/edit-detail:
 *   get:
 *     summary: Lấy chi tiết để sửa trận đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết trận đấu
 */

/**
 * @swagger
 * /admin/match/{id}/edit-detail:
 *   patch:
 *     summary: Cập nhật chi tiết trận đấu
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /admin/ranking:
 *   get:
 *     summary: Tính toán và hiển thị bảng xếp hạng
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bảng xếp hạng
 */
