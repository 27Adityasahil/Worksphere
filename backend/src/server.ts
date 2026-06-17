import http from 'http';
import app from './app';
import connectDB from './config/db';
import { Server } from 'socket.io';
connectDB();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
