import { useNavigate } from 'react-router-dom';

const CalculatorsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Clinical Calculators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/tools/calculators/bsa')}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center space-y-2 hover:scale-105"
        >
          <span className="text-2xl">🧮</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">BSA Calculator</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Body Surface Area</span>
        </button>

        <button
          onClick={() => navigate('/tools/calculators/crcl')}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center space-y-2 hover:scale-105"
        >
          <span className="text-2xl">🧪</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">CrCl Calculator</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Creatinine Clearance</span>
        </button>
      </div>
    </div>
  );
};

export default CalculatorsPage;