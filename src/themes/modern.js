export const modernTheme = {
  name: 'Modern',
  colors: {
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    accent: 'text-blue-600',
  },
  card: 'bg-white rounded-xl shadow-md border border-gray-200',
  button: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all',
  },
  input: 'bg-white border-2 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg',
  badge: {
    MUST: 'bg-red-100 text-red-800 border border-red-300 font-semibold',
    SHOULD: 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold',
    COULD: 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold',
    WONT: 'bg-gray-200 text-gray-700 border border-gray-400 font-semibold',
  },
  status: {
    NOT_STARTED: 'bg-gray-100 text-gray-700 border border-gray-300',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border border-amber-300',
    BLOCKED: 'bg-red-100 text-red-800 border border-red-300',
    DONE: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  },
  progressBar: 'bg-gray-200 rounded-full',
  progressFill: 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-full',
  progressFillDone: 'bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full',
  font: 'font-sans',
  effects: '',
};
