
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({
    teamA: '',
    teamB: ''
  });
  const [scores, setScores] = useState({
    teamA: 0,
    teamB: 0
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const logo = "/lovable-uploads/b7bf2987-fd40-411a-bc74-a5b638e54e50.png";
  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

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

  const updateScore = (team: 'teamA' | 'teamB', points: number) => {
    setScores(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] + points)
    }));
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamNames.teamA && teamNames.teamB) {
      setGameStarted(true);
    }
  };

  if (!gameStarted) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundFrame})`
        }}
      >
        <form onSubmit={handleStartGame} className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
          <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={teamNames.teamA}
                onChange={(e) => setTeamNames(prev => ({ ...prev, teamA: e.target.value }))}
                placeholder="Team A Name"
                className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={teamNames.teamB}
                onChange={(e) => setTeamNames(prev => ({ ...prev, teamB: e.target.value }))}
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
          </div>
        </form>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${backgroundFrame})`
      }}
    >
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? (
          <Minimize2 className="w-8 h-8" />
        ) : (
          <Maximize2 className="w-8 h-8" />
        )}
      </button>

      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <div className="grid grid-cols-2 gap-1 bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="bg-[#3d3935] p-8 text-center">
            <h3 className="text-5xl text-white mb-4 font-extrabold">{teamNames.teamA}</h3>
            <motion.div 
              key={scores.teamA}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-9xl md:text-[12rem] font-black text-white"
            >
              {String(scores.teamA).padStart(2, '0')}
            </motion.div>
          </div>

          <div className="bg-[#3d3935] p-8 text-center">
            <h3 className="text-5xl text-white mb-4 font-extrabold">{teamNames.teamB}</h3>
            <motion.div
              key={scores.teamB}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-9xl md:text-[12rem] font-black text-white"
            >
              {String(scores.teamB).padStart(2, '0')}
            </motion.div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => updateScore('teamA', -1)}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              -1
            </button>
            <button
              onClick={() => updateScore('teamA', 1)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +1
            </button>
            <button
              onClick={() => updateScore('teamA', 2)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +2
            </button>
            <button
              onClick={() => updateScore('teamA', 3)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +3
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => updateScore('teamB', -1)}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              -1
            </button>
            <button
              onClick={() => updateScore('teamB', 1)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +1
            </button>
            <button
              onClick={() => updateScore('teamB', 2)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +2
            </button>
            <button
              onClick={() => updateScore('teamB', 3)}
              className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              +3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
