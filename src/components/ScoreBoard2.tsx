
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import Fireworks from './Fireworks';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

  useEffect(() => {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setGameStarted(parsedData.gameStarted);
      setTeamNames(parsedData.teamNames);
      setScores(parsedData.scores);
      setWinner(parsedData.winner);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gameData' && event.newValue) {
        const updatedData = JSON.parse(event.newValue);
        setWinner(updatedData.winner);
        setScores(updatedData.scores);
        setTeamNames(updatedData.teamNames);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedData = localStorage.getItem('gameData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTeamNames(parsedData.teamNames);
        setScores(parsedData.scores);
      }
    }, 1000);

    return () => clearInterval(interval);
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

  if (!gameStarted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundFrame})` }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setGameStarted(true);
            localStorage.setItem(
              'gameData',
              JSON.stringify({
                gameStarted: true,
                teamNames,
                scores,
                winner: null,
              })
            );
          }}
          className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md"
        >
          <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={teamNames.teamA}
              onChange={(e) => setTeamNames((prev) => ({ ...prev, teamA: e.target.value }))}
              placeholder="Team A Name"
              className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
              required
            />
            <input
              type="text"
              value={teamNames.teamB}
              onChange={(e) => setTeamNames((prev) => ({ ...prev, teamB: e.target.value }))}
              placeholder="Team B Name"
              className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
              required
            />
            <button type="submit" className="w-full py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold">
              Start Game
            </button>
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
      
      <button onClick={toggleFullscreen} className="absolute top-4 right-4 text-white hover:text-gray-200">
        {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
      </button>
      <div className="absolute top-[56%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <ScoreTable teamNames={teamNames} scores={scores} winner={winner} setWinner={setWinner} handleConfetti={handleConfetti} />
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
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => {
            if (winner && winner !== "It's a Tie!") {
              handleConfetti();
            }
            setWinner(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-12 rounded-2xl shadow-[0_0_40px_rgba(254,215,170,0.5)] text-center relative overflow-hidden w-[90%] max-w-3xl border-4 border-yellow-400 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Stars Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhciIgdmlld0JveD0iMCAwIDEwIDEwIiB3aWR0aD0iMTAlIiBoZWlnaHQ9IjEwJSI+PHBvbHlnb24gcG9pbnRzPSI1LDAgNi40NywzLjUzIDEwLDQuMDggNy41LDYuODQgOC4wOSwxMCA1LDguNTMgMS45MSwxMCAyLjUsNi44NCAwLDQuMDggMy41MywzLjUzIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXIpIi8+PC9zdmc+')] opacity-50"></div>
            
            {/* Animated lights */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent animate-[pulse_2s_ease-in-out_infinite_0.5s]"></div>
            
            {/* Trophy Animation */}
            <div className="relative">
              <motion.div 
                className="absolute -inset-4 rounded-full bg-yellow-400/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="text-yellow-400 text-9xl mb-8 relative"
                animate={{ 
                  y: [0, -20, 0],
                  rotateZ: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🏆
              </motion.div>
            </div>

            {/* Animated stars */}
            <div className="absolute top-10 right-10">
              <motion.div
                className="text-yellow-200 text-2xl"
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ✨
              </motion.div>
            </div>
            <div className="absolute bottom-10 left-10">
              <motion.div
                className="text-yellow-200 text-2xl"
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ✨
              </motion.div>
            </div>

            {/* Title with glow */}
            <motion.h2 
              className="text-6xl font-black text-white mb-6 relative text-shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="relative">
                <span className="absolute -inset-2 blur-md bg-white/20 rounded-full"></span>
                Congratulations!
              </span>
            </motion.h2>

            {/* Winner name with gradient text */}
            <motion.div 
              className="my-6 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 opacity-40"></div>
              <p className="text-7xl font-black bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 text-transparent bg-clip-text relative z-10">
                {winner}
              </p>
            </motion.div>        
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
