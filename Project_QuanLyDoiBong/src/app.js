const express = require('express');
const path = require('path');
// config dotenv
require("dotenv").config();
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./router/api');
const connection = require('./config/database');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger"); // Đường dẫn tới file cấu hình Swagger


const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME || 'localhost';
const app = express();
const cookieParser = require('cookie-parser');

//config express file upload
app.use(cookieParser());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//config router
apiRoutes(app);

//config ejs and config static files
configViewEngine(app);

//connect database
(async()=>{
    try {
        await connection();
        app.listen(port, hostname,  () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log("Error connecting to database: ", error);
    }
})()
