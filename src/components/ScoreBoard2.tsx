import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';

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
      {winner && winner !== "It's a Tie!" && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <button onClick={toggleFullscreen} className="absolute top-4 right-4 text-white hover:text-gray-200">
        {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
      </button>
      <div className="absolute top-[58%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
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
          className="fixed inset-0 flex items-center justify-center"
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
            className="bg-white p-10 rounded-2xl shadow-2xl text-center relative overflow-hidden w-[80%] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="text-yellow-400 text-7xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              🏆
            </motion.div>

            <h2 className="text-5xl font-extrabold text-indigo-600">Congratulations!</h2>
            <p className="text-7xl font-extrabold text-gray-700 mt-2">{winner}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
