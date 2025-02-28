
import ScoreBoard from '../components/ScoreBoard';

const Index = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-md z-10 font-bold shadow-md">
        Page 1
      </div>
      <ScoreBoard />
    </div>
  );
};

export default Index;
