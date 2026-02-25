import { LogOut, Download, Upload } from 'lucide-react';

function Header({ onLogout, onExport, onImport }) {

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            JSA IT Weekly
          </h1>
          <p className="text-gray-700 text-sm">
            Quarterly Goals Management
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExport}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2 flex items-center gap-2 text-sm"
            title="Export data"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <label className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2 flex items-center gap-2 text-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>

          <button
            onClick={onLogout}
            className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-500 font-semibold rounded-lg transition-all px-3 py-2 flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
