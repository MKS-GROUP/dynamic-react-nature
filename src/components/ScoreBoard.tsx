import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

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
    if (gameStarted) {
      localStorage.setItem(
        'gameData',
        JSON.stringify({
          gameStarted,
          teamNames,
          scores,
          winner,
        })
      );
    }
  }, [gameStarted, teamNames, scores, winner]);

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
      localStorage.setItem(
        'gameData',
        JSON.stringify({
          gameStarted,
          teamNames,
          scores: updatedScores,
          winner,
        })
      );
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
    localStorage.removeItem('gameData');
    setGameStarted(false);
    setTeamNames({ teamA: '', teamB: '' });
    setScores({ teamA: 0, teamB: 0 });
    setWinner(null);
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
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundFrame})` }}>
      {winner && winner !== "It's a Tie!" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
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

                const updatedData = {
                  gameStarted,
                  teamNames,
                  scores,
                  winner: scores.teamA > scores.teamB ? teamNames.teamA : scores.teamB > scores.teamA ? teamNames.teamB : "It's a Tie!",
                };

                localStorage.setItem('gameData', JSON.stringify(updatedData));
                setWinner(updatedData.winner);
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
        </div>
      </div>

      {winner && (
        <div
          className="fixed inset-0 flex items-center justify-center "
          onClick={() => setWinner(null)}
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

            <h2 className="text-4xl font-extrabold text-indigo-600">Congratulations!</h2>
            <p className="text-7xl font-extrabold text-gray-700 mt-2">{winner}</p>
          </motion.div>
        </div>
      )}

      <Link
        to="/home"
        className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-opacity-90"
      >
        Home
      </Link>
    </div>
  );
};

export default ScoreBoard;
