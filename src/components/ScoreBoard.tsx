
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

const ScoreBoard = () => {
  const [scores, setScores] = useState({
    teamA: 5,
    teamB: 6
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
      [team]: Math.max(0, prev[team] + points) // Prevent negative scores
    }));
  };

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

      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
        <div className="grid grid-cols-2 gap-1 bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="bg-[#3d3935] p-8 text-center">
            <h3 className="text-2xl text-white mb-4">Team A</h3>
            <motion.div 
              key={scores.teamA}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-8xl md:text-9xl font-bold text-white"
            >
              {String(scores.teamA).padStart(2, '0')}
            </motion.div>
          </div>

          <div className="bg-[#3d3935] p-8 text-center">
            <h3 className="text-2xl text-white mb-4">Team B</h3>
            <motion.div
              key={scores.teamB}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-8xl md:text-9xl font-bold text-white"
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
