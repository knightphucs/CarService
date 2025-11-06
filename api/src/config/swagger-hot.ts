import fs from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';

export function setupSwaggerHotReload(server: any) {
  const wss = new WebSocketServer({ server });
  const schemaPath = path.resolve(__dirname, '../../schemas/all-schemas.json');

  wss.on('connection', (ws) => {
    console.log('🔌 Swagger UI connected for hot reload');
  });

  fs.watch(schemaPath, (eventType) => {
    if (eventType === 'change') {
      console.log('♻️ Schema updated -> Reloading Swagger UI');
      wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send('reload');
      });
    }
  });
}
