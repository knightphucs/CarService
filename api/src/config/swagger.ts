import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CarService API',
      version: '1.0.0',
      description: 'API documentation for CarService backend',
    },
    components: {
      schemas: {
        ProductResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            engine: { type: 'number' },
            fuel: { type: 'string' },
            available: { type: 'string' },
            image: { type: 'string' },
            seats: { type: 'number' },
            transmission: { type: 'string' },
            made_in: { type: 'string' },
            brand: {
              type: 'object',
              properties: { id: { type: 'string' }, name: { type: 'string' } },
            },
            category: {
              type: 'object',
              properties: { id: { type: 'string' }, name: { type: 'string' } },
            },
          },
        },
        ProductCreateDto: {
          type: 'object',
          required: ['name', 'price', 'brand_id', 'category_id'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            engine: { type: 'number' },
            fuel: { type: 'string' },
            image: { type: 'string' },
            seats: { type: 'number' },
            transmission: { type: 'string' },
            made_in: { type: 'string' },
            brand_id: { type: 'string' },
            category_id: { type: 'string' },
          },
        },
        ProductUpdateDto: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
          },
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // đổi nếu deploy server
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/**/*.ts'), path.join(__dirname, '../controllers/**/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => res.json(swaggerSpec));
}
