
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Maximize2, Minimize2 } from 'lucide-react';

// const ScoreBoard = () => {
//   const [gameStarted, setGameStarted] = useState(false);
//   const [teamNames, setTeamNames] = useState({
//     teamA: '',
//     teamB: ''
//   });
//   const [scores, setScores] = useState({
//     teamA: 0,
//     teamB: 0
//   });
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const logo = "/lovable-uploads/b7bf2987-fd40-411a-bc74-a5b638e54e50.png";
//   const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//         setIsFullscreen(false);
//       }
//     }
//   };

//   const updateScore = (team: 'teamA' | 'teamB', points: number) => {
//     setScores(prev => ({
//       ...prev,
//       [team]: Math.max(0, prev[team] + points)
//     }));
//   };

//   const handleStartGame = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (teamNames.teamA && teamNames.teamB) {
//       setGameStarted(true);
//     }
//   };

//   if (!gameStarted) {
//     return (
//       <div 
//         className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
//         style={{
//           backgroundImage: `url(${backgroundFrame})`
//         }}
//       >
//         <form onSubmit={handleStartGame} className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
//           <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
//           <div className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamA}
//                 onChange={(e) => setTeamNames(prev => ({ ...prev, teamA: e.target.value }))}
//                 placeholder="Team A Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamB}
//                 onChange={(e) => setTeamNames(prev => ({ ...prev, teamB: e.target.value }))}
//                 placeholder="Team B Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
//             >
//               Start Game
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat relative"
//       style={{
//         backgroundImage: `url(${backgroundFrame})`
//       }}
//     >
//       <button
//         onClick={toggleFullscreen}
//         className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
//         aria-label="Toggle fullscreen"
//       >
//         {isFullscreen ? (
//           <Minimize2 className="w-8 h-8" />
//         ) : (
//           <Maximize2 className="w-8 h-8" />
//         )}
//       </button>

//       <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
//         <div className="grid grid-cols-2 gap-1 bg-[#1a1a1a] rounded-lg overflow-hidden">
//           <div className="bg-[#3d3935] p-8 text-center">
//             <h3 className="text-5xl text-white mb-4 font-extrabold">{teamNames.teamA}</h3>
//             <motion.div 
//               key={scores.teamA}
//               initial={{ scale: 1 }}
//               animate={{ scale: [1, 1.1, 1] }}
//               transition={{ duration: 0.3 }}
//               className="text-9xl md:text-[12rem] font-black text-white"
//             >
//               {String(scores.teamA).padStart(2, '0')}
//             </motion.div>
//           </div>

//           <div className="bg-[#3d3935] p-8 text-center">
//             <h3 className="text-5xl text-white mb-4 font-extrabold">{teamNames.teamB}</h3>
//             <motion.div
//               key={scores.teamB}
//               initial={{ scale: 1 }}
//               animate={{ scale: [1, 1.1, 1] }}
//               transition={{ duration: 0.3 }}
//               className="text-9xl md:text-[12rem] font-black text-white"
//             >
//               {String(scores.teamB).padStart(2, '0')}
//             </motion.div>
//           </div>
//         </div>

//         <div className="mt-8 grid grid-cols-2 gap-8">
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => updateScore('teamA', -1)}
//               className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               -1
//             </button>
//             <button
//               onClick={() => updateScore('teamA', 1)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +1
//             </button>
//             <button
//               onClick={() => updateScore('teamA', 2)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +2
//             </button>
//             <button
//               onClick={() => updateScore('teamA', 3)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +3
//             </button>
//           </div>
//           <div className="flex justify-center gap-2">
//             <button
//               onClick={() => updateScore('teamB', -1)}
//               className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               -1
//             </button>
//             <button
//               onClick={() => updateScore('teamB', 1)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +1
//             </button>
//             <button
//               onClick={() => updateScore('teamB', 2)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +2
//             </button>
//             <button
//               onClick={() => updateScore('teamB', 3)}
//               className="px-4 py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all"
//             >
//               +3
//             </button>
//           </div>
//         </div>
//         <div className="mt-8 flex flex-col items-center gap-4">
//   <div className="flex gap-4">
//   <button 
//   onClick={() => setScores({ teamA: 0, teamB: 0 })} // Reset scores to 0
//   className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
// >
//   Reset
// </button>

//     <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90 transition-all">
//       Win
//     </button>
//   </div>

//   {/* New Button Below */}
//   <button 
//     onClick={() => alert("New Button Clicked!")} 
//     className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
//   >
//     Next Game
//   </button>
// </div>

//       </div>
//     </div>
//   );
// };

// export default ScoreBoard;



// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Maximize2, Minimize2 } from 'lucide-react';

// const ScoreBoard = () => {
//   const [gameStarted, setGameStarted] = useState(false);
//   const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
//   const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [winner, setWinner] = useState<string | null>(null);

//   const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//         setIsFullscreen(false);
//       }
//     }
//   };

//   const updateScore = (team: 'teamA' | 'teamB', points: number) => {
//     setScores(prev => ({
//       ...prev,
//       [team]: Math.max(0, prev[team] + points),
//     }));
//   };

//   const handleStartGame = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (teamNames.teamA && teamNames.teamB) {
//       setGameStarted(true);
//     }
//   };

//   const determineWinner = () => {
//     if (scores.teamA > scores.teamB) {
//       setWinner(teamNames.teamA);
//     } else if (scores.teamB > scores.teamA) {
//       setWinner(teamNames.teamB);
//     } else {
//       setWinner("It's a Tie!");
//     }
//   };

//   if (!gameStarted) {
//     return (
//       <div 
//         className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
//         style={{
//           backgroundImage: `url(${backgroundFrame})`
//         }}
//       >
//         <form onSubmit={handleStartGame} className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
//           <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
//           <div className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamA}
//                 onChange={(e) => setTeamNames(prev => ({ ...prev, teamA: e.target.value }))}
//                 placeholder="Team A Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamB}
//                 onChange={(e) => setTeamNames(prev => ({ ...prev, teamB: e.target.value }))}
//                 placeholder="Team B Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
//             >
//               Start Game
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundFrame})` }}>
//       <button
//         onClick={toggleFullscreen}
//         className="absolute top-4 right-4 text-white hover:text-gray-200"
//         aria-label="Toggle fullscreen"
//       >
//         {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
//       </button>

//       <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
//         <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] rounded-lg overflow-hidden">
//           {['teamA', 'teamB'].map((team) => (
//             <div key={team} className="bg-[#3d3935] p-4 text-center">
//               <h3 className="text-6xl text-white mb-4 font-extrabold">{teamNames[team]}</h3>
//               <motion.div 
//                 key={scores[team]}
//                 initial={{ scale: 1 }}
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 0.3 }}
//                 className="text-9xl md:text-[12rem] font-black text-white"
//               >
//                 {String(scores[team]).padStart(2, '0')}
//               </motion.div>
//             </div>
//           ))}
//         </div>

//         {/* Score Buttons */}
//         <div className="mt-8 grid grid-cols-2 gap-8">
//           {['teamA', 'teamB'].map((team) => (
//             <div key={team} className="flex justify-center gap-2">
//               {[-1, 1, 2, 3].map((points) => (
//                 <button
//                   key={points}
//                   onClick={() => updateScore(team, points)}
//                   className={`px-4 py-3 rounded-lg transition-all ${
//                     points < 0 ? 'bg-red-500' : 'bg-[#FF8C00]'
//                   } text-white hover:bg-opacity-90`}
//                 >
//                   {points > 0 ? `+${points}` : points}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Reset, Win, Next Game Buttons */}
//         <div className="mt-8 flex flex-col items-center gap-4">
//           <div className="flex gap-4">
//             <button 
//               onClick={() => setScores({ teamA: 0, teamB: 0 })} 
//               className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90"
//             >
//               Reset
//             </button>
//             <button 
//               onClick={determineWinner} 
//               className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90"
//             >
//               Win
//             </button>
//           </div>
//           {/* <button 
//             onClick={() => alert("Next Game Clicked!")} 
//             className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
//           >
//             Next Game
//           </button> */}

// <button 
//   onClick={() => {
//     setGameStarted(false);
//     setTeamNames({ teamA: '', teamB: '' });
//     setScores({ teamA: 0, teamB: 0 });
//     setWinner(null);
//   }} 
//   className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
// >
//   Next Game
// </button>

//         </div>
//       </div>

//       {/* Winner Popup - Click outside to close */}
//       {winner && (
//         <div 
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
//           onClick={() => setWinner(null)}  // Close when clicking outside
//         >
//           <motion.div 
//             initial={{ scale: 0.5, opacity: 0 }} 
//             animate={{ scale: 1, opacity: 1 }} 
//             transition={{ duration: 0.4 }}
//             className="bg-white text-black p-10 rounded-lg text-center shadow-2xl w-[80%] max-w-4xl"
//             onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
//           >
//             <h2 className="text-6xl md:text-8xl font-extrabold">{winner}</h2>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScoreBoard;





// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Maximize2, Minimize2 } from 'lucide-react';

// const ScoreBoard = () => {
//   const [gameStarted, setGameStarted] = useState(false);
//   const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
//   const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [winner, setWinner] = useState<string | null>(null);

//   const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

//   // Retrieve the game data from localStorage
//   useEffect(() => {
//     const savedData = localStorage.getItem('gameData');
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setGameStarted(parsedData.gameStarted);
//       setTeamNames(parsedData.teamNames);
//       setScores(parsedData.scores);
//       setWinner(parsedData.winner);
//     }
//   }, []);

//   // Save the game data to localStorage
//   useEffect(() => {
//     if (gameStarted) {
//       localStorage.setItem(
//         'gameData',
//         JSON.stringify({
//           gameStarted,
//           teamNames,
//           scores,
//           winner,
//         })
//       );
//     }
//   }, [gameStarted, teamNames, scores, winner]);

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//         setIsFullscreen(false);
//       }
//     }
//   };

//   const updateScore = (team: 'teamA' | 'teamB', points: number) => {
//     setScores((prev) => {
//       const updatedScores = {
//         ...prev,
//         [team]: Math.max(0, prev[team] + points),
//       };
//       // Update localStorage when scores change
//       localStorage.setItem(
//         'gameData',
//         JSON.stringify({
//           gameStarted,
//           teamNames,
//           scores: updatedScores,
//           winner,
//         })
//       );
//       return updatedScores;
//     });
//   };

//   const handleStartGame = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (teamNames.teamA && teamNames.teamB) {
//       setGameStarted(true);
//     }
//   };

//   const determineWinner = () => {
//     if (scores.teamA > scores.teamB) {
//       setWinner(teamNames.teamA);
//     } else if (scores.teamB > scores.teamA) {
//       setWinner(teamNames.teamB);
//     } else {
//       setWinner("It's a Tie!");
//     }
//   };

//   const handleNextGame = () => {
//     // Clear localStorage when the next game is started
//     localStorage.removeItem('gameData');
//     setGameStarted(false);
//     setTeamNames({ teamA: '', teamB: '' });
//     setScores({ teamA: 0, teamB: 0 });
//     setWinner(null);
//   };

//   if (!gameStarted) {
//     return (
//       <div
//         className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
//         style={{
//           backgroundImage: `url(${backgroundFrame})`,
//         }}
//       >
//         <form onSubmit={handleStartGame} className="bg-[#3d3935] p-8 rounded-lg w-[90%] max-w-md">
//           <h2 className="text-3xl text-white mb-6 font-bold">Enter Team Names</h2>
//           <div className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamA}
//                 onChange={(e) => setTeamNames((prev) => ({ ...prev, teamA: e.target.value }))}
//                 placeholder="Team A Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 value={teamNames.teamB}
//                 onChange={(e) => setTeamNames((prev) => ({ ...prev, teamB: e.target.value }))}
//                 placeholder="Team B Name"
//                 className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-[#FF8C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-bold"
//             >
//               Start Game
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundFrame})` }}>
//       <button
//         onClick={toggleFullscreen}
//         className="absolute top-4 right-4 text-white hover:text-gray-200"
//         aria-label="Toggle fullscreen"
//       >
//         {isFullscreen ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
//       </button>

//       <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]">
//         <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] rounded-lg overflow-hidden">
//           {['teamA', 'teamB'].map((team) => (
//             <div key={team} className="bg-[#3d3935] p-4 text-center">
//               <h3 className="text-6xl text-white mb-4 font-extrabold">{teamNames[team]}</h3>
//               <motion.div
//                 key={scores[team]}
//                 initial={{ scale: 1 }}
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 0.3 }}
//                 className="text-9xl md:text-[12rem] font-black text-white"
//               >
//                 {String(scores[team]).padStart(2, '0')}
//               </motion.div>
//             </div>
//           ))}
//         </div>

//         {/* Score Buttons */}
//         <div className="mt-8 grid grid-cols-2 gap-8">
//           {['teamA', 'teamB'].map((team) => (
//             <div key={team} className="flex justify-center gap-2">
//               {[-1, 1, 2, 3].map((points) => (
//                 <button
//                   key={points}
//                   onClick={() => updateScore(team, points)}
//                   className={`px-4 py-3 rounded-lg transition-all ${points < 0 ? 'bg-red-500' : 'bg-[#FF8C00]'} text-white hover:bg-opacity-90`}
//                 >
//                   {points > 0 ? `+${points}` : points}
//                 </button>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Reset, Win, Next Game Buttons */}
//         <div className="mt-8 flex flex-col items-center gap-4">
//           <div className="flex gap-4">
//             <button
//               onClick={() => setScores({ teamA: 0, teamB: 0 })}
//               className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90"
//             >
//               Reset
//             </button>
//             <button
//               onClick={determineWinner}
//               className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-opacity-90"
//             >
//               Win
//             </button>
//           </div>
//           <button
//             onClick={handleNextGame}
//             className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
//           >
//             Next Game
//           </button>
//         </div>
//       </div>

//       {/* Winner Popup - Click outside to close */}
//       {winner && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
//           onClick={() => setWinner(null)} // Close when clicking outside
//         >
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="bg-white text-black p-10 rounded-lg text-center shadow-2xl w-[80%] max-w-4xl"
//             onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
//           >
//             <h2 className="text-6xl md:text-8xl font-extrabold">{winner}</h2>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScoreBoard;
 


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import Confetti from 'react-confetti';

const ScoreBoard = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState({ teamA: '', teamB: '' });
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const backgroundFrame = "/lovable-uploads/499c5578-5601-4c64-a518-93c9507be712.png";

  // Retrieve the game data from localStorage
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

  // Save the game data to localStorage
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

  const updateScore = (team: 'teamA' | 'teamB', points: number) => {
    setScores((prev) => {
      const updatedScores = {
        ...prev,
        [team]: Math.max(0, prev[team] + points),
      };
      // Update localStorage when scores change
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
    // Clear localStorage when the next game is started
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
      {/* Confetti when a winner is announced */}
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
          {['teamA', 'teamB'].map((team) => (
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

        {/* Score Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          {['teamA', 'teamB'].map((team) => (
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

        {/* Reset, Win, Next Game Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setScores({ teamA: 0, teamB: 0 })}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-opacity-90"
            >
              Reset
            </button>
            <button
              onClick={determineWinner}
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
         <button
          onClick={() => window.location.href = '/home'}
          className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
         >
          Home
         </button>
      </div>

      {/* Winner Popup - Click outside to close */}
      {winner && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setWinner(null)} // Close when clicking outside
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white text-black p-10 rounded-lg text-center shadow-2xl w-[80%] max-w-4xl"
            onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
          >
            <h2 className="text-6xl md:text-8xl font-extrabold">{winner}</h2>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
