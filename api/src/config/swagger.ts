import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

export function setupSwagger(app: Express) {
  // Load schemas đã generate
  const schemaPath = path.resolve(__dirname, '../../schemas/all-schemas.json');
  let definitions = {};

  try {
    if (fs.existsSync(schemaPath)) {
      const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      definitions = schemaData.definitions || {};
      console.log(`Loaded ${Object.keys(definitions).length} schemas from all-schemas.json`);
    } else {
      console.warn('No schemas found. Run `npm run generate:schemas` first.');
    }
  } catch (err) {
    console.error('Failed to load schemas:', err);
  }

  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'CarService API',
        version: '1.0.0',
        description: 'API documentation for CarService backend (auto-generated schemas)',
      },
      components: {
        schemas: definitions,
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
    // Swagger vẫn đọc mô tả từ route
    apis: [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../controllers/*.ts')],
  };

  const swaggerSpec = swaggerJsdoc(options);

  const isDev = process.env['NODE_ENV'] !== 'production';

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customJs: isDev ? '/swagger-reload.js' : undefined,
    })
  );

  app.get('/swagger-reload.js', (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
    const ws = new WebSocket('ws://' + location.host);
    ws.onmessage = (msg) => {
      if (msg.data === 'reload') {
        console.log('Swagger UI reloading...');
        location.reload();
      }
    };
  `);
  });
}
