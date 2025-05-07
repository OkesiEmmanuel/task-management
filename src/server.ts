import http from 'http';

import { Server } from 'socket.io';
import { createServer } from 'http';
import app from './app';
import { initSocket } from './infrastructure/websocket/socket.emitter';
import { setupSocketIO } from './infrastructure/websocket/socket.facade';

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
setupSocketIO(io);
initSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
