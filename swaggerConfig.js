const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'API Accademy Docs',
        version: '1.0.0',
        description: 'Description of your API',
        },
        servers: [
        {
            url: 'http://localhost:8080', // Change this to your server URL
        },
        ],
    },
    apis: ['./Controller/*.js','./routes/registerRoutes.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = specs;
