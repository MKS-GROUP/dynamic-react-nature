
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

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
  console.log('New client connected:', socket.id);
  
  // Send current game data to new connections
  socket.emit('gameData', gameData);

  // Listen for game data updates
  socket.on('updateGameData', (data) => {
    console.log('Received update from client:', socket.id);
    gameData = data;
    // Broadcast to ALL clients including sender to ensure consistency
    io.emit('gameData', gameData);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Endpoints
app.get('/api/game', (req, res) => {
  console.log('GET request for game data');
  res.json(gameData);
});

app.post('/api/game', (req, res) => {
  console.log('POST request to update game data');
  gameData = req.body;
  // Broadcast updates to all connected clients
  io.emit('gameData', gameData);
  res.json({ success: true });
});

// Start the server - bind to all network interfaces with 0.0.0.0
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on all interfaces at port ${PORT}`);
  console.log('Available on:');
  
  // Get local IP addresses to display to user
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  http://${net.address}:${PORT}`);
      }
    }
  }
});
