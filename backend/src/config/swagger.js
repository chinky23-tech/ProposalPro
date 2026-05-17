import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProposalPro API Documentation',
      version: '1.0.0',
      description: 'API documentation for the ProposalPro backend application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Paths to files containing OpenAPI definitions (your routes)
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;