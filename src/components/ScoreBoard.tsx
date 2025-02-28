
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Settings, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import Fireworks from './Fireworks';
import { audioService } from '../lib/audioService';
import { apiService } from '../lib/apiService';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  const [serverUrl, setServerUrl] = useState(apiService.getConnectionUrl());
  const [newServerUrl, setNewServerUrl] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

  // Function to synchronize game data with server
  const syncWithServer = useCallback(async () => {
    if (!gameStarted) return;
    
    const gameData = {
      gameStarted,
      teamNames,
      scores,
      winner,
    };

    console.log('Syncing with server:', gameData);
    
    // Save to localStorage as fallback
    localStorage.setItem('gameData', JSON.stringify(gameData));
    
    // Send to API - no need to await this as it's now queue-based
    apiService.updateGameData(gameData)
      .then(success => {
        if (success) {
          setIsConnected(true);
          setLastUpdateTime(Date.now());
        }
      })
      .catch(error => {
        console.error('Failed to queue update:', error);
      });
  }, [gameStarted, teamNames, scores, winner]);

  // Load initial data when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getGameData();
        if (data) {
          console.log('Successfully loaded data from server:', data);
          setGameStarted(data.gameStarted);
          setTeamNames(data.teamNames);
          setScores(data.scores);
          setWinner(data.winner);
          setIsConnected(true);
          setLastUpdateTime(Date.now());
        } else {
          console.log('Failed to load from server, trying localStorage');
          // Fall back to localStorage if API is not available
          const savedData = localStorage.getItem('gameData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setGameStarted(parsedData.gameStarted);
            setTeamNames(parsedData.teamNames);
            setScores(parsedData.scores);
            setWinner(parsedData.winner);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fall back to localStorage
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setGameStarted(parsedData.gameStarted);
          setTeamNames(parsedData.teamNames);
          setScores(parsedData.scores);
          setWinner(parsedData.winner);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const handleUpdate = (data: any) => {
      console.log('Received update from subscription:', data);
      setGameStarted(data.gameStarted);
      setTeamNames(data.teamNames);
      setScores(data.scores);
      setWinner(data.winner);
      setIsConnected(true);
      setLastUpdateTime(Date.now());
    };

    apiService.subscribeToUpdates(handleUpdate);

    return () => {
      // Cleanup subscription
      apiService.unsubscribeFromUpdates(handleUpdate);
    };
  }, []);

  // Play victory sound when winner is set
  useEffect(() => {
    if (winner && winner !== "It's a Tie!") {
      audioService.playVictorySound();
    } else {
      audioService.stopVictorySound();
    }

    // Stop sound when component unmounts
    return () => {
      audioService.stopVictorySound();
    };
  }, [winner]);

  // Sync data to backend and localStorage when state changes
  useEffect(() => {
    if (gameStarted) {
      // Sync immediately for more responsive updates
      syncWithServer();
    }
  }, [gameStarted, teamNames, scores, winner, syncWithServer]);

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
    
    // Force an immediate sync instead of waiting for useEffect
    setTimeout(() => syncWithServer(), 0);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamNames.teamA && teamNames.teamB) {
      setGameStarted(true);
      // Immediate sync when game starts
      setTimeout(() => {
        syncWithServer();
      }, 0);
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
    
    // Force an immediate sync
    setTimeout(() => syncWithServer(), 0);
  };

  const handleNextGame = () => {
    localStorage.removeItem('gameData');
    setGameStarted(false);
    setTeamNames({ teamA: '', teamB: '' });
    setScores({ teamA: 0, teamB: 0 });
    setWinner(null);
    
    // Force an immediate sync
    setTimeout(() => syncWithServer(), 0);
  };

  const handleChangeServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServerUrl) {
      apiService.setServerUrl(newServerUrl);
      setServerUrl(apiService.getConnectionUrl());
      setShowConnectionInfo(false);
      // Try to fetch data from new server
      setTimeout(() => {
        apiService.getGameData().then(data => {
          if (data) {
            setGameStarted(data.gameStarted);
            setTeamNames(data.teamNames);
            setScores(data.scores);
            setWinner(data.winner);
            setIsConnected(true);
          }
        });
      }, 500);
    }
  };

  const shareLink = () => {
    // Extract the host from the current URL
    const serverHost = serverUrl.replace('http://', '').replace(':5000', '');
    const shareUrl = `${window.location.origin}${window.location.pathname}?server=${serverHost}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Link copied to clipboard: ' + shareUrl))
      .catch(err => console.error('Could not copy link: ', err));
  };

  const forceSync = () => {
    syncWithServer();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="mb-4 text-2xl">Loading Scoreboard...</div>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundFrame})`,
        }}
      >
        <div 
          className={`absolute top-4 right-4 px-3 py-1 rounded flex items-center gap-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}
          onClick={() => setShowConnectionInfo(prev => !prev)}
        >
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span className="text-sm">{isConnected ? 'Connected' : 'Offline Mode'}</span>
        </div>
        
        {showConnectionInfo && (
          <div className="absolute top-16 right-4 bg-gray-800 p-4 rounded shadow-lg text-white z-20 w-72">
            <h3 className="text-lg font-bold mb-2">Connection Settings</h3>
            <p className="text-xs mb-2">Current server: {serverUrl}</p>
            <form onSubmit={handleChangeServer} className="space-y-2">
              <input
                type="text"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                placeholder="Server IP (e.g. 192.168.1.5)"
                className="w-full p-2 rounded bg-gray-700 text-white text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  Connect
                </button>
                <button 
                  type="button" 
                  onClick={shareLink}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Share Link
                </button>
              </div>
            </form>
          </div>
        )}
        
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
      <div 
        className={`absolute top-4 left-4 px-3 py-1 rounded flex items-center gap-2 cursor-pointer ${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white z-10`}
        onClick={() => setShowConnectionInfo(prev => !prev)}
      >
        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        <span className="text-sm">{isConnected ? 'Connected' : 'Offline Mode'}</span>
      </div>
      
      {showConnectionInfo && (
        <div className="absolute top-16 left-4 bg-gray-800 p-4 rounded shadow-lg text-white z-20 w-72">
          <h3 className="text-lg font-bold mb-2">Connection Settings</h3>
          <p className="text-xs mb-2">Current server: {serverUrl}</p>
          <form onSubmit={handleChangeServer} className="space-y-2">
            <input
              type="text"
              value={newServerUrl}
              onChange={(e) => setNewServerUrl(e.target.value)}
              placeholder="Server IP (e.g. 192.168.1.5)"
              className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Connect
              </button>
              <button 
                type="button" 
                onClick={shareLink}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Share Link
              </button>
              <button 
                type="button" 
                onClick={forceSync}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <RefreshCw size={14} /> Sync
              </button>
            </div>
          </form>
        </div>
      )}
      
      {winner && winner !== "It's a Tie!" && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <Fireworks />
        </>
      )}

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setShowConnectionInfo(prev => !prev)}
          className="text-white hover:text-gray-200"
          aria-label="Settings"
        >
          <Settings className="w-8 h-8" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="text-white hover:text-gray-200"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
        </button>
      </div>

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
            <div key={team} className="flex flex-wrap justify-center gap-2">
              {[-1, 1, 2, 3].map((points) => (
                <button
                  key={points}
                  onClick={() => {
                    updateScore(team, points);
                  }}
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
              onClick={() => {
                setScores({ teamA: 0, teamB: 0 });
                // Force immediate sync after reset
                setTimeout(() => syncWithServer(), 0);
              }}
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
        </div>
      </div>

      {winner && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setWinner(null)}
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
