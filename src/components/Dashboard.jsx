import { useState, useEffect } from 'react';
import { LogOut, Plus, Archive, FileText, Download, Upload } from 'lucide-react';
import { 
  saveEncryptedData, 
  loadEncryptedData, 
  hasStoredData,
  exportData,
  importData 
} from '../utils/crypto';
import { 
  getCurrentQuarter, 
  getQuarterLabel, 
  getQuarterEndDate,
  createEmptyQuarter 
} from '../utils/quarters';
import { Q1_2026_GOALS, Q1_2026_RETROSPECTIVE, Q1_2026_QUARTER_NOTES } from '../data/seedData';
import Header from './Header';
import GoalsList from './GoalsList';
import GoalForm from './GoalForm';
import QuarterSelector from './QuarterSelector';
import RetrospectiveModal from './RetrospectiveModal';
import QuarterNotesModal from './QuarterNotesModal';

function Dashboard({ password, onLogout }) {
  const [data, setData] = useState({ quarters: [] });
  const [currentQuarter, setCurrentQuarter] = useState(getCurrentQuarter());
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showRetro, setShowRetro] = useState(false);
  const [showQuarterNotes, setShowQuarterNotes] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterOwner, setFilterOwner] = useState('ALL');

  const migrateLegacyQuarterNotes = (sourceData) => {
    if (!sourceData?.quarters?.length) return sourceData;

    let changed = false;
    const migrated = JSON.parse(JSON.stringify(sourceData));

    for (const quarter of migrated.quarters) {
      if (typeof quarter.quarterNotes !== 'string') {
        quarter.quarterNotes = '';
        changed = true;
      }

      if (
        !quarter.quarterNotes &&
        typeof quarter.retrospective === 'string' &&
        quarter.retrospective.includes('Meeting Notes')
      ) {
        quarter.quarterNotes = quarter.retrospective;
        quarter.retrospective = '';
        changed = true;
      }
    }

    return changed ? migrated : sourceData;
  };

  useEffect(() => {
    if (hasStoredData()) {
      const loaded = loadEncryptedData(password);
      if (loaded && loaded.quarters && loaded.quarters.length > 0) {
        const migrated = migrateLegacyQuarterNotes(loaded);
        setData(migrated);
        if (migrated !== loaded) {
          saveEncryptedData(migrated, password);
        }
      } else {
        initializeData();
      }
    } else {
      initializeData();
    }
  }, [password]);

  const initializeData = () => {
    const { year, quarter } = getCurrentQuarter();
    
    if (year === 2026 && quarter === 1) {
      const q1Quarter = createEmptyQuarter(2026, 1);
      q1Quarter.goals = Q1_2026_GOALS;
      q1Quarter.quarterNotes = Q1_2026_QUARTER_NOTES;
      q1Quarter.retrospective = Q1_2026_RETROSPECTIVE;
      const initialData = { quarters: [q1Quarter] };
      setData(initialData);
      saveEncryptedData(initialData, password);
    } else {
      const initialQuarter = createEmptyQuarter(year, quarter);
      const initialData = { quarters: [initialQuarter] };
      setData(initialData);
      saveEncryptedData(initialData, password);
    }
  };

  const saveData = (newData) => {
    setData(newData);
    saveEncryptedData(newData, password);
  };

  const getNextQuarter = (year, quarter) => {
    if (quarter === 4) {
      return { year: year + 1, quarter: 1 };
    }
    return { year, quarter: quarter + 1 };
  };

  const applyBusinessRules = (sourceData) => {
    if (!sourceData?.quarters?.length) return null;

    const now = new Date();
    const nowIso = now.toISOString();
    const newData = JSON.parse(JSON.stringify(sourceData));
    let changed = false;

    const ensureQuarter = (year, quarter) => {
      let target = newData.quarters.find(q => q.year === year && q.quarter === quarter);
      if (!target) {
        target = createEmptyQuarter(year, quarter);
        newData.quarters.push(target);
      }
      return target;
    };

    for (const quarter of newData.quarters) {
      const remainingGoals = [];

      for (const goal of quarter.goals) {
        const overdue = goal.deadline && new Date(goal.deadline) < now && goal.status !== 'DONE';

        if (!overdue) {
          remainingGoals.push(goal);
          continue;
        }

        if (goal.category === 'MUST') {
          if (goal.status !== 'BLOCKED') {
            goal.status = 'BLOCKED';
            goal.updatedAt = nowIso;
            changed = true;
          }
          remainingGoals.push(goal);
          continue;
        }

        if (goal.category === 'SHOULD' || goal.category === 'COULD') {
          const next = getNextQuarter(quarter.year, quarter.quarter);
          const nextQuarter = ensureQuarter(next.year, next.quarter);

          const rolledGoal = {
            ...goal,
            id: `${goal.id}-r-${Date.now()}`,
            status: 'NOT_STARTED',
            progress: 0,
            deadline: getQuarterEndDate(next.year, next.quarter),
            updatedAt: nowIso,
            completedAt: null,
            notes: goal.notes
              ? `${goal.notes} | Rolled over from ${getQuarterLabel(quarter.year, quarter.quarter)}`
              : `Rolled over from ${getQuarterLabel(quarter.year, quarter.quarter)}`,
          };

          nextQuarter.goals.push(rolledGoal);
          changed = true;
          continue;
        }

        remainingGoals.push(goal);
      }

      quarter.goals = remainingGoals;
    }

    return changed ? newData : null;
  };

  useEffect(() => {
    const updated = applyBusinessRules(data);
    if (updated) {
      setData(updated);
      saveEncryptedData(updated, password);
    }
  }, [data, password]);

  const calculateQuarterScore = (goals) => {
    const weights = { MUST: 0.6, SHOULD: 0.25, COULD: 0.15 };

    const avgProgress = (category) => {
      const subset = goals.filter(g => g.category === category);
      if (subset.length === 0) return 0;
      const total = subset.reduce((sum, g) => sum + (g.progress || 0), 0);
      return total / subset.length;
    };

    const must = avgProgress('MUST');
    const should = avgProgress('SHOULD');
    const could = avgProgress('COULD');
    const total = must * weights.MUST + should * weights.SHOULD + could * weights.COULD;

    return {
      total: Math.round(total),
      must: Math.round(must),
      should: Math.round(should),
      could: Math.round(could),
    };
  };

  const handleReorderGoals = (updatedGoals) => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );

    if (quarter) {
      quarter.goals = updatedGoals;
      saveData(newData);
    }
  };

  const getActiveQuarter = () => {
    return data.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    ) || createEmptyQuarter(currentQuarter.year, currentQuarter.quarter);
  };

  const handleSaveGoal = (goal) => {
    const newData = { ...data };
    let quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );

    if (!quarter) {
      quarter = createEmptyQuarter(currentQuarter.year, currentQuarter.quarter);
      newData.quarters.push(quarter);
    }

    if (editingGoal) {
      const index = quarter.goals.findIndex(g => g.id === editingGoal.id);
      quarter.goals[index] = { ...goal, updatedAt: new Date().toISOString() };
    } else {
      quarter.goals.push(goal);
    }

    saveData(newData);
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId) => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );
    
    if (quarter) {
      quarter.goals = quarter.goals.filter(g => g.id !== goalId);
      saveData(newData);
    }
  };

  const handleUpdateProgress = (goalId, newProgress) => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );
    
    if (quarter) {
      const goal = quarter.goals.find(g => g.id === goalId);
      if (goal) {
        const previousStatus = goal.status;
        goal.progress = newProgress;
        
        // Auto-update status based on progress (unless manually set to BLOCKED)
        if (goal.status !== 'BLOCKED') {
          if (newProgress === 0) {
            goal.status = 'NOT_STARTED';
            goal.completedAt = null; // Clear completion date if reset to 0
          } else if (newProgress === 100) {
            goal.status = 'DONE';
            // Set completion date only if status changed to DONE
            if (previousStatus !== 'DONE') {
              goal.completedAt = new Date().toISOString();
            }
          } else {
            goal.status = 'IN_PROGRESS';
            goal.completedAt = null; // Clear completion date if in progress
          }
        }
        
        goal.updatedAt = new Date().toISOString();
        saveData(newData);
      }
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleSaveRetrospective = (notes) => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );
    
    if (quarter) {
      quarter.retrospective = notes;
      saveData(newData);
    }
    setShowRetro(false);
  };

  const handleSaveQuarterNotes = (notes) => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );

    if (quarter) {
      quarter.quarterNotes = notes;
      saveData(newData);
    }
    setShowQuarterNotes(false);
  };

  const handleArchiveQuarter = () => {
    const newData = { ...data };
    const quarter = newData.quarters.find(
      q => q.year === currentQuarter.year && q.quarter === currentQuarter.quarter
    );
    
    if (quarter) {
      quarter.isArchived = true;
      saveData(newData);
    }
  };

  const handleExport = () => {
    exportData(data);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file, (importedData, error) => {
        if (error) {
          alert(`Import failed: ${error}`);
        } else {
          saveData(importedData);
          alert('Data imported successfully!');
        }
      });
    }
  };

  const activeQuarter = getActiveQuarter();
  const quarterScore = calculateQuarterScore(activeQuarter.goals || []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <Header 
          onLogout={onLogout}
          onExport={handleExport}
          onImport={handleImport}
        />

        <QuarterSelector
          currentQuarter={currentQuarter}
          setCurrentQuarter={setCurrentQuarter}
          quarters={data.quarters}
        />

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {getQuarterLabel(currentQuarter.year, currentQuarter.quarter)} Goals
              {activeQuarter.isArchived && ' (Archived)'}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowGoalForm(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all px-4 py-2 flex items-center gap-2"
                disabled={activeQuarter.isArchived}
              >
                <Plus className="w-4 h-4" />
                New Goal
              </button>
              
              <button
                onClick={() => setShowRetro(true)}
                className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-4 py-2 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Retrospective
              </button>

              <button
                onClick={() => setShowQuarterNotes(true)}
                className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-4 py-2 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Quarter Notes
              </button>
              
              {!activeQuarter.isArchived && (
                <button
                  onClick={handleArchiveQuarter}
                  className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-4 py-2 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Quarter Score</h3>
              <span className="text-lg font-bold text-blue-700">{quarterScore.total}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-2"
                style={{ width: `${quarterScore.total}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 flex flex-wrap gap-4">
              <span>MUST: <strong>{quarterScore.must}%</strong></span>
              <span>SHOULD: <strong>{quarterScore.should}%</strong></span>
              <span>COULD: <strong>{quarterScore.could}%</strong></span>
              <span className="text-gray-500">(Gewichtung 60 / 25 / 15)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="ALL">All</option>
                <option value="MUST">Must Have</option>
                <option value="SHOULD">Should Have</option>
                <option value="COULD">Could Have</option>
                <option value="WONT">Won't Have</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Owner:
              </span>
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg px-3 py-2 text-sm"
              >
                <option value="ALL">All</option>
                <option value="Maike">Maike</option>
                <option value="Bacha">Bacha</option>
                <option value="Johannes">Johannes</option>
                <option value="Maxi">Maxi</option>
                <option value="Kai">Kai</option>
              </select>
            </div>
          </div>

          <GoalsList
            goals={activeQuarter.goals}
            filterCategory={filterCategory}
            filterOwner={filterOwner}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            onUpdateProgress={handleUpdateProgress}
            onReorder={handleReorderGoals}
            isArchived={activeQuarter.isArchived}
          />
        </div>

        {showGoalForm && (
          <GoalForm
            goal={editingGoal}
            onSave={handleSaveGoal}
            onCancel={() => {
              setShowGoalForm(false);
              setEditingGoal(null);
            }}
          />
        )}

        {showRetro && (
          <RetrospectiveModal
            retrospective={activeQuarter.retrospective}
            onSave={handleSaveRetrospective}
            onClose={() => setShowRetro(false)}
          />
        )}

        {showQuarterNotes && (
          <QuarterNotesModal
            notes={activeQuarter.quarterNotes}
            onSave={handleSaveQuarterNotes}
            onClose={() => setShowQuarterNotes(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
