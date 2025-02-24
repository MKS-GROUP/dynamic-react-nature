
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
  const tournamentImage = "/lovable-uploads/91e2055b-0c48-41a1-be7b-7401405767e8.png";

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
    <div className="min-h-screen bg-[#2d2e36]">
      <div 
        className="relative bg-[#FF8C00] min-h-screen"
        style={{
          backgroundImage: `url(${tournamentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 pt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              LALITPUR HISSAN
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-200 transition-colors"
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
          <h2 className="text-4xl md:text-5xl text-white mt-8 mb-16">Live Score</h2>

          <div className="grid grid-cols-2 gap-1 max-w-4xl mx-auto bg-[#1a1a1a] rounded-lg overflow-hidden">
            <div className="bg-[#3d3935] p-8 text-center">
              <h3 className="text-2xl md:text-3xl text-white mb-8">Team A</h3>
              <motion.div 
                key={scores.teamA}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-9xl font-bold text-white"
              >
                {String(scores.teamA).padStart(2, '0')}
              </motion.div>
            </div>

            <div className="bg-[#3d3935] p-8 text-center">
              <h3 className="text-2xl md:text-3xl text-white mb-8">Team B</h3>
              <motion.div
                key={scores.teamB}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-9xl font-bold text-white"
              >
                {String(scores.teamB).padStart(2, '0')}
              </motion.div>
            </div>
          </div>

          <div className="mt-12 text-center pb-8">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setScores(prev => ({ ...prev, teamA: prev.teamA + 1 }))}
                className="px-6 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Team A +1
              </button>
              <button
                onClick={() => setScores(prev => ({ ...prev, teamB: prev.teamB + 1 }))}
                className="px-6 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
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
