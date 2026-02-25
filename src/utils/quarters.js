export const TEAM_MEMBERS = ['Maike', 'Bacha', 'Johannes', 'Maxi', 'Kai'];

export const CATEGORIES = {
  MUST: 'MUST',
  SHOULD: 'SHOULD',
  COULD: 'COULD',
  WONT: 'WONT'
};

export const STATUSES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE'
};

export const STATUS_LABELS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  DONE: 'Done'
};

export const getCurrentQuarter = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return { year, quarter };
};

export const getQuarterLabel = (year, quarter) => {
  return `Q${quarter} ${year}`;
};

export const getQuarterEndDate = (year, quarter) => {
  const lastMonth = quarter * 3;
  const lastDay = new Date(year, lastMonth, 0).getDate();
  return `${year}-${String(lastMonth).padStart(2, '0')}-${lastDay}`;
};

export const getQuarterStartDate = (year, quarter) => {
  const firstMonth = (quarter - 1) * 3 + 1;
  return `${year}-${String(firstMonth).padStart(2, '0')}-01`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const createEmptyGoal = () => ({
  id: Date.now().toString(),
  title: '',
  description: '',
  category: CATEGORIES.MUST,
  owner: TEAM_MEMBERS[0],
  members: [],
  deadline: '',
  status: STATUSES.NOT_STARTED,
  progress: 0,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: null
});

export const createEmptyQuarter = (year, quarter) => ({
  id: `${year}-Q${quarter}`,
  year,
  quarter,
  goals: [],
  quarterNotes: '',
  retrospective: '',
  isArchived: false,
  createdAt: new Date().toISOString()
});
