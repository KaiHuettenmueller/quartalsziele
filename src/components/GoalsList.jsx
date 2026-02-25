import { useState } from 'react';
import { Edit2, Trash2, Lock, CheckCircle2, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, STATUS_LABELS } from '../utils/quarters';
import { formatDate, isOverdue } from '../utils/quarters';

function GoalsList({ goals, filterCategory, filterOwner, onEdit, onDelete, onUpdateProgress, onReorder, isArchived }) {
  const [lockedGoals, setLockedGoals] = useState(new Set());
  const [editingProgress, setEditingProgress] = useState(null);
  const filteredGoals = goals.filter(goal => {
    const categoryMatch = filterCategory === 'ALL' || goal.category === filterCategory;
    const ownerMatch = filterOwner === 'ALL' || goal.owner === filterOwner;
    return categoryMatch && ownerMatch;
  });

  const groupedGoals = {
    MUST: filteredGoals.filter(g => g.category === CATEGORIES.MUST),
    SHOULD: filteredGoals.filter(g => g.category === CATEGORIES.SHOULD),
    COULD: filteredGoals.filter(g => g.category === CATEGORIES.COULD),
    WONT: filteredGoals.filter(g => g.category === CATEGORIES.WONT),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'text-terminal-green';
      case 'IN_PROGRESS': return 'text-yellow-500';
      case 'BLOCKED': return 'text-red-500';
      default: return 'text-terminal-darkgreen';
    }
  };

  const getBadgeClass = (category) => {
    const badges = {
      MUST: 'bg-red-100 text-red-800 border border-red-300',
      SHOULD: 'bg-amber-100 text-amber-800 border border-amber-300',
      COULD: 'bg-blue-100 text-blue-800 border border-blue-300',
      WONT: 'bg-gray-200 text-gray-700 border border-gray-400',
    };
    return badges[category] || badges.COULD;
  };

  const getStatusClass = (status) => {
    const statuses = {
      NOT_STARTED: 'bg-gray-100 text-gray-700 border border-gray-300',
      IN_PROGRESS: 'bg-amber-100 text-amber-800 border border-amber-300',
      BLOCKED: 'bg-red-100 text-red-800 border border-red-300',
      DONE: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    };
    return statuses[status] || statuses.NOT_STARTED;
  };

  const moveGoal = (goal, direction, categoryGoals) => {
    const currentVisibleIndex = categoryGoals.findIndex(g => g.id === goal.id);
    if (currentVisibleIndex === -1) return;

    const targetVisibleIndex = direction === 'up' ? currentVisibleIndex - 1 : currentVisibleIndex + 1;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= categoryGoals.length) return;

    const targetGoal = categoryGoals[targetVisibleIndex];
    const reorderedAllGoals = [...goals];

    const fromIndex = reorderedAllGoals.findIndex(g => g.id === goal.id);
    const toIndex = reorderedAllGoals.findIndex(g => g.id === targetGoal.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const [movedGoal] = reorderedAllGoals.splice(fromIndex, 1);
    reorderedAllGoals.splice(toIndex, 0, movedGoal);

    if (onReorder) {
      onReorder(reorderedAllGoals);
    }
  };

  const handleProgressChange = (goal, newProgress) => {
    if (onUpdateProgress) {
      const progress = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
      onUpdateProgress(goal.id, progress);
    }
  };

  const toggleLock = (goalId) => {
    setLockedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  const handleMarkDone = (goal) => {
    if (onUpdateProgress) {
      onUpdateProgress(goal.id, 100);
    }
    if (onEdit) {
      onEdit({ ...goal, status: 'DONE', progress: 100 });
    }
  };

  const handleProgressInputChange = (goal, value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    if (numValue === '' || (parseInt(numValue) >= 0 && parseInt(numValue) <= 100)) {
      handleProgressChange(goal, numValue || '0');
    }
  };

  const renderGoal = (goal, index, categoryGoals) => {
    const isLocked = lockedGoals.has(goal.id);
    const isEditingThisProgress = editingProgress === goal.id;
    const isFirst = index === 0;
    const isLast = index === categoryGoals.length - 1;

    const getCardStyle = () => {
      if (goal.status === 'DONE') {
        return 'border-emerald-400 border-2 bg-emerald-50/30';
      } else if (goal.status === 'IN_PROGRESS') {
        return 'border-amber-400 border-2 bg-amber-50/20';
      } else if (goal.status === 'BLOCKED') {
        return 'border-red-400 border-2 bg-red-50/20';
      } else if (isLocked) {
        return 'border-amber-300';
      } else {
        return 'border-gray-200';
      }
    };

    return (
    <div
      key={goal.id}
      className={`bg-white rounded-xl shadow-md border p-5 mb-4 transition-all hover:shadow-lg relative ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
              {index + 1}
            </span>
            {!isArchived && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLock(goal.id);
                }}
                className={`transition-colors ${
                  isLocked ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'
                }`}
                title={isLocked ? 'Unlock position' : 'Lock position'}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
          {!isArchived && !isLocked && (
            <div 
              className="flex flex-col gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  moveGoal(goal, 'up', categoryGoals);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                disabled={isFirst}
                className={`transition-colors ${
                  isFirst ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'
                }`}
                title="Move up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  moveGoal(goal, 'down', categoryGoals);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                disabled={isLast}
                className={`transition-colors ${
                  isLast ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'
                }`}
                title="Move down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-bold ${
              goal.status === 'DONE' ? 'text-emerald-700' : 'text-gray-900'
            }`}>
              {goal.title}
            </h3>
            {goal.status === 'DONE' && (
              <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
            )}
            <span className={`${getBadgeClass(goal.category)} font-semibold px-3 py-1 text-xs rounded-full`}>
              {goal.category}
            </span>
          </div>
          <p className="text-gray-700 text-sm mb-3">{goal.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-gray-500">
              Owner: <span className="font-semibold text-gray-900">{goal.owner}</span>
            </span>
            {goal.members && goal.members.length > 0 && (
              <span className="text-gray-500">
                Members: <span className="font-semibold text-gray-900">{goal.members.join(', ')}</span>
              </span>
            )}
            <span className="text-gray-500">
              Deadline: <span className={`font-semibold ${isOverdue(goal.deadline) && goal.status !== 'DONE' ? 'text-red-600' : 'text-gray-900'}`}>{formatDate(goal.deadline)}</span>
            </span>
            {goal.completedAt && (
              <span className="text-emerald-600">
                Completed: <span className="font-semibold">{formatDate(goal.completedAt)}</span>
              </span>
            )}
            <span className={`${getStatusClass(goal.status)} px-3 py-1 text-xs rounded-full`}>
              {STATUS_LABELS[goal.status]}
            </span>
          </div>
        </div>

        {!isArchived && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(goal)}
              className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2"
              title="Edit goal"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2"
              title="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-500">Progress:</span>
          {!isArchived ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={goal.progress}
                onChange={(e) => handleProgressInputChange(goal, e.target.value)}
                onFocus={() => setEditingProgress(goal.id)}
                onBlur={() => setEditingProgress(null)}
                className="w-16 bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded px-2 py-1 text-sm font-bold text-center"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm font-bold text-gray-900">%</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={goal.progress}
                onChange={(e) => handleProgressChange(goal, e.target.value)}
                className="flex-1 accent-blue-600 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
              {goal.status !== 'DONE' && (
                <button
                  onClick={() => handleMarkDone(goal)}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 font-semibold rounded-lg transition-all px-3 py-1 flex items-center gap-1 text-sm"
                  title="Mark as done"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Done
                </button>
              )}
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
          )}
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className={goal.status === 'DONE' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full' : 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-full'}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {goal.notes && (
        <div className="text-sm text-gray-700 border-l-4 border-blue-400 pl-3 py-1 mt-2 italic">
          <span className="font-semibold">Notes:</span> {goal.notes}
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
        categoryGoals.length > 0 && (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {category} Have
              </h3>
              <span className={`${getBadgeClass(category)} font-semibold px-3 py-1 text-xs rounded-full`}>
                {categoryGoals.length} {categoryGoals.length === 1 ? 'goal' : 'goals'}
              </span>
            </div>
            <div>
              {categoryGoals.map((goal, index) => renderGoal(goal, index, categoryGoals))}
            </div>
          </div>
        )
      ))}

      {filteredGoals.length === 0 && (
        <div className="text-center py-12 text-terminal-darkgreen">
          <div className="text-2xl mb-2">┌─────────────────┐</div>
          <div className="text-2xl mb-2">│  NO GOALS FOUND │</div>
          <div className="text-2xl">└─────────────────┘</div>
        </div>
      )}
    </div>
  );
}

export default GoalsList;
