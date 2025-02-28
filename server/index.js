
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game data storage
let gameData = {
  gameStarted: false,
  teamNames: { teamA: '', teamB: '' },
  scores: { teamA: 0, teamB: 0 },
  winner: null,
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send current game data to new connections
  socket.emit('gameData', gameData);

  // Listen for game data updates
  socket.on('updateGameData', (data) => {
    gameData = data;
    // Broadcast to all clients except sender
    socket.broadcast.emit('gameData', gameData);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// REST API Endpoints
app.get('/api/game', (req, res) => {
  res.json(gameData);
});

app.post('/api/game', (req, res) => {
  gameData = req.body;
  // Broadcast updates to all connected clients
  io.emit('gameData', gameData);
  res.json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
