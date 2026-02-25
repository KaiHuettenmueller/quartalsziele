import { useState } from 'react';
import { X } from 'lucide-react';

function QuarterNotesModal({ notes, onSave, onClose }) {
  const [value, setValue] = useState(notes || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quarter Notes</h2>
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Kickoff Notes / Important Notes
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-64 resize-none"
              placeholder="Write key quarter notes, decisions, and context..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex-1 py-3"
            >
              Save Notes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all flex-1 py-3"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuarterNotesModal;
