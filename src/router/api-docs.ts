import express from "express"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Animals API",
      version: "1.0.0",
      description: "API documentation for the Animals service",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/router/*.ts"],
}
const swaggerSpec = swaggerJSDoc(options)

export default (router: express.Router) => {
  router.use("/api-docs", swaggerUi.serve)
  router.get("/api-docs", swaggerUi.setup(swaggerSpec))
}
