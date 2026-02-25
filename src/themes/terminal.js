export const terminalTheme = {
  name: 'Terminal',
  colors: {
    bg: 'bg-[#1a1a1a]',
    text: 'text-[#e0e0e0]',
    textSecondary: 'text-[#a0a0a0]',
    textMuted: 'text-[#707070]',
    accent: 'text-[#00d9ff]',
  },
  card: 'border border-[#404040] bg-[#252525] shadow-lg',
  button: {
    primary: 'bg-[#00d9ff] border-none text-black hover:bg-[#00b8d4] font-mono font-bold shadow-md',
    secondary: 'bg-[#2a2a2a] border border-[#505050] text-[#e0e0e0] hover:bg-[#353535] hover:border-[#00d9ff] font-mono',
  },
  input: 'bg-[#2a2a2a] border border-[#505050] text-[#e0e0e0] focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 font-mono',
  badge: {
    MUST: 'bg-red-900/40 text-red-300 border border-red-700 font-semibold',
    SHOULD: 'bg-amber-900/40 text-amber-300 border border-amber-700 font-semibold',
    COULD: 'bg-cyan-900/40 text-cyan-300 border border-cyan-700 font-semibold',
    WONT: 'bg-gray-800/40 text-gray-400 border border-gray-600 font-semibold',
  },
  status: {
    NOT_STARTED: 'bg-gray-800/40 text-gray-300 border border-gray-600',
    IN_PROGRESS: 'bg-amber-900/40 text-amber-300 border border-amber-700',
    BLOCKED: 'bg-red-900/40 text-red-300 border border-red-700',
    DONE: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700',
  },
  progressBar: 'bg-[#2a2a2a] border border-[#404040] rounded',
  progressFill: 'bg-gradient-to-r from-[#00d9ff] to-[#0099cc] rounded',
  font: 'font-mono',
  effects: '',
};
