import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuarterLabel } from '../utils/quarters';

function QuarterSelector({ currentQuarter, setCurrentQuarter, quarters }) {
  const handlePrevQuarter = () => {
    const { year, quarter } = currentQuarter;
    if (quarter === 1) {
      setCurrentQuarter({ year: year - 1, quarter: 4 });
    } else {
      setCurrentQuarter({ year, quarter: quarter - 1 });
    }
  };

  const handleNextQuarter = () => {
    const { year, quarter } = currentQuarter;
    if (quarter === 4) {
      setCurrentQuarter({ year: year + 1, quarter: 1 });
    } else {
      setCurrentQuarter({ year, quarter: quarter + 1 });
    }
  };

  const isArchived = quarters.find(
    q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
  )?.isArchived;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevQuarter}
          className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-4 py-2 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {getQuarterLabel(currentQuarter.year, currentQuarter.quarter)}
          </div>
          {isArchived && (
            <div className="text-xs text-gray-500 mt-1">
              Archived
            </div>
          )}
        </div>

        <button
          onClick={handleNextQuarter}
          className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-4 py-2 flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default QuarterSelector;
