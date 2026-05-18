interface CoursePaginationProps {
  totalItems: number;
  filteredItems: number;
}

export function CoursePagination({ totalItems, filteredItems }: CoursePaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500 font-medium">
        Showing {filteredItems} of {totalItems} courses
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">Previous</button>
        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-bold shadow-md shadow-violet-100">1</button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">2</button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">Next</button>
      </div>
    </div>
  );
}