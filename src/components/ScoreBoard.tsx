
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

  return (
    <div className="min-h-screen bg-tournament-dark">
      <div className="relative overflow-hidden">
        <div className="bg-tournament-orange py-8 relative">
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 320" className="w-full h-20">
              <path
                fill="#2D2D2D"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                LALITPUR HISSAN
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-tournament-darker transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-8 h-8" />
                  ) : (
                    <Maximize2 className="w-8 h-8" />
                  )}
                </button>
                <img src={logo} alt="Tournament Logo" className="w-20 md:w-32" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl text-white mt-2">Live Score</h2>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-tournament-darker rounded-lg p-6 text-center transform transition-all hover:scale-105">
              <h3 className="text-2xl md:text-3xl text-white mb-4">Team A</h3>
              <motion.div 
                key={scores.teamA}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-6xl md:text-8xl font-bold text-tournament-orange"
              >
                {String(scores.teamA).padStart(2, '0')}
              </motion.div>
            </div>

            <div className="bg-tournament-darker rounded-lg p-6 text-center transform transition-all hover:scale-105">
              <h3 className="text-2xl md:text-3xl text-white mb-4">Team B</h3>
              <motion.div
                key={scores.teamB}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-6xl md:text-8xl font-bold text-tournament-orange"
              >
                {String(scores.teamB).padStart(2, '0')}
              </motion.div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl text-white mb-4">Tournament Controls</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setScores(prev => ({ ...prev, teamA: prev.teamA + 1 }))}
                className="px-6 py-3 bg-tournament-orange text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Team A +1
              </button>
              <button
                onClick={() => setScores(prev => ({ ...prev, teamB: prev.teamB + 1 }))}
                className="px-6 py-3 bg-tournament-orange text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Team B +1
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
