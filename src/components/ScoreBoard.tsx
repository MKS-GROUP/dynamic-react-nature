
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import Fireworks from './Fireworks';
import { gameDataRef, updateGameData, onValue } from '../lib/firebase';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>(() => {
    // Get room ID from URL or create a new one
    const params = new URLSearchParams(window.location.search);
    const id = params.get('room') || `room-${Math.random().toString(36).substring(2, 8)}`;
    return id;
  });

  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

  // Save data to localStorage
  useEffect(() => {
    const data = JSON.stringify({
      gameStarted,
      teamNames,
      scores,
      winner,
    });
    localStorage.setItem('gameData', data);
  }, [gameStarted, teamNames, scores, winner]);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setGameStarted(data.gameStarted);
      setTeamNames(data.teamNames);
      setScores(data.scores);
      setWinner(data.winner);
    }
  }, []);

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

  const updateScore = (team: 'teamA' | 'teamB', points: number) => {
    setScores((prev) => {
      const updatedScores = {
        ...prev,
        [team]: Math.max(0, prev[team] + points),
      };
      return updatedScores;
    });
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamNames.teamA && teamNames.teamB) {
      setGameStarted(true);
    }
  };

  const determineWinner = () => {
    if (scores.teamA > scores.teamB) {
      setWinner(teamNames.teamA);
    } else if (scores.teamB > scores.teamA) {
      setWinner(teamNames.teamB);
    } else {
      setWinner("It's a Tie!");
    }
  };

  const handleNextGame = () => {
    setGameStarted(false);
    setTeamNames({ teamA: '', teamB: '' });
    setScores({ teamA: 0, teamB: 0 });
    setWinner(null);
  };

  const copyRoomLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Room link copied to clipboard! Share this with others to join the same scoreboard.');
  };

  if (!gameStarted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundFrame})`,
        }}
      >
        <form onSubmit={handleStartGame} className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
          <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={teamNames.teamA}
                onChange={(e) => setTeamNames((prev) => ({ ...prev, teamA: e.target.value }))}
                placeholder="Team A Name"
                className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={teamNames.teamB}
                onChange={(e) => setTeamNames((prev) => ({ ...prev, teamB: e.target.value }))}
                placeholder="Team B Name"
                className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
            >
              Start Game
            </button>
            
            <div className="mt-4 p-4 bg-black/20 rounded-lg">
              <p className="text-white text-sm mb-2">Room ID: {roomId}</p>
              <button
                type="button"
                onClick={copyRoomLink}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Copy Room Link to Share
              </button>
            </div>
          </div>
        </form>
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

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 text-white hover:text-gray-200"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
      </button>

      <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] rounded-lg overflow-hidden">
          {(['teamA', 'teamB'] as const).map((team) => (
            <div key={team} className="bg-[#3d3935] p-4 text-center">
              <h3 className="text-6xl text-white mb-4 font-extrabold">{teamNames[team]}</h3>
              <motion.div
                key={scores[team]}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-9xl md:text-[12rem] font-black text-white"
              >
                {String(scores[team]).padStart(2, '0')}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          {(['teamA', 'teamB'] as const).map((team) => (
            <div key={team} className="flex justify-center gap-2">
              {[-1, 1, 2, 3].map((points) => (
                <button
                  key={points}
                  onClick={() => updateScore(team, points)}
                  className={`px-4 py-3 rounded-lg transition-all ${points < 0 ? 'bg-red-500' : 'bg-[#FF8C00]'} text-white hover:bg-opacity-90`}
                >
                  {points > 0 ? `+${points}` : points}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-4" >
            <button
              onClick={() => setScores({ teamA: 0, teamB: 0 })}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90"
            >
              Reset
            </button>
            <button
              onClick={() => {
                handleConfetti();
                determineWinner();
              }}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90"
            >
              Win
            </button>
          </div>
          <button
            onClick={handleNextGame}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
          >
            Next Game
          </button>
          
          <div className="mt-4 p-3 bg-black/20 rounded-lg flex items-center gap-2">
            <span className="text-white text-sm">Room: {roomId}</span>
            <button
              onClick={copyRoomLink}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-opacity-90"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {winner && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30"
          onClick={() => setWinner(null)}
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

      <Link
        to="/home"
        className="absolute bottom-4 left-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-opacity-90"
      >
        Home
      </Link>
    </div>
  );
};

export default ScoreBoard;
