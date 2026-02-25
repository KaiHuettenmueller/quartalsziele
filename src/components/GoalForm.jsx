import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, STATUSES, STATUS_LABELS, TEAM_MEMBERS, createEmptyGoal } from '../utils/quarters';

function GoalForm({ goal, onSave, onCancel }) {
  const [formData, setFormData] = useState(goal || createEmptyGoal());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {goal ? 'Edit Goal' : 'New Goal'}
          </h2>
          <button
            onClick={onCancel}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              placeholder="Enter goal title..."
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
              placeholder="Enter goal description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              >
                {Object.values(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Owner
              </label>
              <select
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              >
                {TEAM_MEMBERS.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Members (Team)
            </label>
            <div className="flex flex-wrap gap-2">
              {TEAM_MEMBERS.map(member => (
                <label key={member} className="flex items-center gap-2 bg-gray-50 border-2 border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.members?.includes(member) || false}
                    onChange={(e) => {
                      const currentMembers = formData.members || [];
                      if (e.target.checked) {
                        handleChange('members', [...currentMembers, member]);
                      } else {
                        handleChange('members', currentMembers.filter(m => m !== member));
                      }
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">{member}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Completed Date
              </label>
              <input
                type="date"
                value={formData.completedAt ? formData.completedAt.split('T')[0] : ''}
                onChange={(e) => handleChange('completedAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2"
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => handleChange('progress', parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-2"
                style={{ width: `${formData.progress}%` }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 h-24 resize-none"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex-1 py-3"
            >
              Save Goal
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all flex-1 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalForm;
