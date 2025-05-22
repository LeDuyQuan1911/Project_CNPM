// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tên API của bạn",
      version: "1.0.0",
      description: "Tài liệu API với Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // Thay đổi nếu dùng port khác
      },
    ],
  },
  apis: ["./router/*.js"], // Đường dẫn tới các file định nghĩa API (Swagger annotations)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
