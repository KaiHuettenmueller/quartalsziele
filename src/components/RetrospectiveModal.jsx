import { useState } from 'react';
import { X } from 'lucide-react';
const EMPTY_RETRO = {
  format: 'retrospective_v1',
  quarter: '',
  overallScore: '',
  mustDone: '',
  shouldDone: '',
  couldDone: '',
  wins: '',
  missesAndRootCauses: '',
  blockers: '',
  stopDoing: '',
  startDoing: '',
  keepDoing: '',
  topMust1: '',
  topMust2: '',
  topMust3: '',
  firstMilestone: '',
  owner: '',
  followUpDate: '',
  additionalNotes: '',
};

const parseRetrospective = (raw) => {
  if (!raw) return { ...EMPTY_RETRO };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.format === 'retrospective_v1') {
      return { ...EMPTY_RETRO, ...parsed };
    }
  } catch {
    // legacy free text stays in additionalNotes
  }
  return { ...EMPTY_RETRO, additionalNotes: raw };
};

function RetrospectiveModal({ retrospective, onSave, onClose }) {
  const [form, setForm] = useState(parseRetrospective(retrospective));

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(JSON.stringify(form, null, 2));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quarterly Retrospective</h2>
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Quarter</label>
              <input
                type="text"
                value={form.quarter}
                onChange={(e) => setField('quarter', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
                placeholder="Q1 2026"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Overall Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.overallScore}
                onChange={(e) => setField('overallScore', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">MUST done</label>
              <input
                type="text"
                value={form.mustDone}
                onChange={(e) => setField('mustDone', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
                placeholder="5 / 7"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">SHOULD done</label>
              <input
                type="text"
                value={form.shouldDone}
                onChange={(e) => setField('shouldDone', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
                placeholder="3 / 5"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">COULD done</label>
              <input
                type="text"
                value={form.couldDone}
                onChange={(e) => setField('couldDone', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
                placeholder="2 / 6"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Wins (Was lief gut?)</label>
            <textarea
              value={form.wins}
              onChange={(e) => setField('wins', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Misses & Root Causes</label>
            <textarea
              value={form.missesAndRootCauses}
              onChange={(e) => setField('missesAndRootCauses', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Blockers</label>
            <textarea
              value={form.blockers}
              onChange={(e) => setField('blockers', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Stop doing</label>
              <textarea
                value={form.stopDoing}
                onChange={(e) => setField('stopDoing', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Start doing</label>
              <textarea
                value={form.startDoing}
                onChange={(e) => setField('startDoing', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Keep doing</label>
              <textarea
                value={form.keepDoing}
                onChange={(e) => setField('keepDoing', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Top MUST #1</label>
              <input
                type="text"
                value={form.topMust1}
                onChange={(e) => setField('topMust1', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Top MUST #2</label>
              <input
                type="text"
                value={form.topMust2}
                onChange={(e) => setField('topMust2', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Top MUST #3</label>
              <input
                type="text"
                value={form.topMust3}
                onChange={(e) => setField('topMust3', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">First milestone (first 2 weeks)</label>
              <input
                type="text"
                value={form.firstMilestone}
                onChange={(e) => setField('firstMilestone', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Owner</label>
              <input
                type="text"
                value={form.owner}
                onChange={(e) => setField('owner', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Follow-up date</label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setField('followUpDate', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Additional notes</label>
              <input
                type="text"
                value={form.additionalNotes}
                onChange={(e) => setField('additionalNotes', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex-1 py-3"
            >
              Save Retrospective
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

        {retrospective && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleString('de-DE')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetrospectiveModal;
