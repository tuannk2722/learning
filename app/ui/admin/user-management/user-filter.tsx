import { Search } from "lucide-react";

interface UserFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function UserFilter({ searchQuery, onSearchChange, statusFilter, onStatusChange }: UserFilterProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <select
          className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-blue-600"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Users</option>
          <option value="Active">Active</option>
          <option value="Banned">Banned</option>
        </select>
        <button
          className='w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-blue-600'
          onClick={() => {
            onSearchChange('');
            onStatusChange('All');
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}