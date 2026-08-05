import swaggerJsdoc from "swagger-jsdoc";
import { schemas } from "./swagger_schemas.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "REST API for managing personal finances.",
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas,
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
