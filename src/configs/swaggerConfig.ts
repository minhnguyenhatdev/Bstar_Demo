export const options = {
    definition: {
        openapi: "3.0.1",
        info : {
            title: "Inventory API",
            version: "0.0.1",
            description: "API for APP Inventory"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            }
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: "apiKey",
                name: "access_token",
                scheme: "bearer",
                in: "header",
              },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["src/routers/*.ts"]
}