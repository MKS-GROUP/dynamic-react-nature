
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import Fireworks from './Fireworks';
import { gameDataRef, onValue } from '../lib/firebase';
import { ref } from 'firebase/database';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>(() => {
    // Get room ID from URL or use default
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || 'default-room';
  });

  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

  // Load data from Firebase when it changes
  useEffect(() => {
    const roomRef = ref(gameDataRef, roomId);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameStarted(data.gameStarted);
        setTeamNames(data.teamNames);
        setScores(data.scores);
        setWinner(data.winner);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Join a different room
  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('room-id') as HTMLInputElement;
    const newRoomId = input.value.trim();
    if (newRoomId) {
      setRoomId(newRoomId);
      const newUrl = `${window.location.pathname}?room=${newRoomId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  if (!gameStarted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundFrame})` }}
      >
        <div className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
          <h2 className="text-3xl text-white mb-6 font-bold">Waiting for Game to Start</h2>
          <p className="text-white mb-4">
            This is a viewer display. Please wait for the game to be started on the control panel, or join a specific room.
          </p>
          
          <form onSubmit={joinRoom} className="mt-6">
            <div className="mb-4">
              <label htmlFor="room-id" className="block text-white mb-2">Enter Room ID to Join:</label>
              <input
                id="room-id"
                type="text"
                defaultValue={roomId}
                className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
            >
              Join Room
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <p className="text-white text-sm">Current Room: {roomId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundFrame})` }}>
      {winner && winner !== "It's a Tie!" && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <Fireworks />
        </>
      )}
      
      <button onClick={toggleFullscreen} className="absolute top-4 right-4 text-white hover:text-gray-200">
        {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
      </button>
      
      <div className="absolute top-[56%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <ScoreTable teamNames={teamNames} scores={scores} winner={winner} setWinner={setWinner} handleConfetti={handleConfetti} />
      </div>
      
      <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/30 rounded text-white text-sm">
        Connected to Room: {roomId}
      </div>
    </div>
  );
};

const ScoreTable = ({ 
  teamNames, 
  scores, 
  winner, 
  setWinner,
  handleConfetti 
}: { 
  teamNames: { teamA: string, teamB: string }, 
  scores: { teamA: number, teamB: number }, 
  winner: string | null, 
  setWinner: (winner: string | null) => void,
  handleConfetti: () => void 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
      {['teamA', 'teamB'].map((team) => (
        <div key={team} className="bg-[#3d3935] p-8 text-center">
          <h3 className="text-6xl text-white mb-4 font-extrabold">{teamNames[team as keyof typeof teamNames]}</h3>
          <motion.div
            key={scores[team as keyof typeof scores]}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="text-9xl md:text-[12rem] font-black text-white"
            style={{ fontSize: '14.2rem' }}
          >
            {String(scores[team as keyof typeof scores]).padStart(2, '0')}
          </motion.div>
        </div>
      ))}

      {winner && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={() => {
            if (winner && winner !== "It's a Tie!") {
              handleConfetti();
            }
            setWinner(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-12 rounded-2xl shadow-2xl text-center relative overflow-hidden w-[90%] max-w-3xl border-4 border-yellow-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhciIgdmlld0JveD0iMCAwIDEwIDEwIiB3aWR0aD0iMTAlIiBoZWlnaHQ9IjEwJSI+PHBvbHlnb24gcG9pbnRzPSI1LDAgNi40NywzLjUzIDEwLDQuMDggNy41LDYuODQgOC4wOSwxMCA1LDguNTMgMS45MSwxMCAyLjUsNi44NCAwLDQuMDggMy41MywzLjUzIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXIpIi8+PC9zdmc+')] opacity-30" />
            
            <motion.div 
              className="text-yellow-400 text-8xl mb-6"
              animate={{ 
                y: [0, -20, 0],
                rotateZ: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🏆
            </motion.div>

            <motion.h2 
              className="text-5xl font-black text-white mb-4 relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Congratulations!
            </motion.h2>

            <motion.p 
              className="text-7xl font-black bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 text-transparent bg-clip-text mt-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {winner}
            </motion.p>

            <motion.button
              className="mt-8 px-8 py-3 bg-yellow-400 text-purple-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWinner(null)}
            >
              Continue Playing
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
