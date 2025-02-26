import { useEffect, useState } from "react";

const startFireworks = () => {
  const fireworkScript = document.createElement("script");
  fireworkScript.src = "/fireworks.js"; // Save the provided fireworks HTML/JS in a separate file and load it
  fireworkScript.async = true;
  document.body.appendChild(fireworkScript);
};

const stopFireworks = () => {
  document.querySelectorAll(".particle, .rising").forEach((el) => el.remove());
};

export default function ScoreBoard() {
  const [fireworksActive, setFireworksActive] = useState(false);
  const winner = true; // Define the winner variable

  useEffect(() => {
    if (fireworksActive) {
      startFireworks();
    } else {
      stopFireworks();
    }
  }, [fireworksActive]);

  return (
    <div>
      {winner && (
        <button
          onClick={() => setFireworksActive(!fireworksActive)}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
        >
          {fireworksActive ? "Stop Fireworks" : "Start Fireworks"}
        </button>
      )}
    </div>
  );
}


export { startFireworks, stopFireworks };