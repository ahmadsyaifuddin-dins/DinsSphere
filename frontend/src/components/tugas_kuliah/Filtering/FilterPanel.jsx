import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FilterPanel = ({ 
  filterText, 
  setFilterText, 
  mataKuliahOptions,
  filters,
  setFilters,
  applyFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    applyFilters(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      mataKuliah: '',
      progress: '',
      dueDate: '',
      tingkatKesulitan: ''  // Ubah dari prioritas ke tingkatKesulitan
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    applyFilters(resetFilters);
  };

  return (
    <div className="mb-4 bg-gray-800 rounded-lg border border-gray-700">
      {/* Filter Header */}
      <div className="flex justify-between items-center p-3 cursor-pointer"
           onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-blue-400" />
          <span className="font-medium text-gray-200">Filter Tugas</span>
        </div>
        <div className="flex items-center space-x-2">
          {(filters.status || filters.mataKuliah || filters.progress || filters.dueDate || filters.tingkatKesulitan) && (
            <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
              Filters Applied
            </span>
          )}
          <span className="text-gray-400 text-sm">
            {isExpanded ? 'Sembunyikan' : 'Tampilkan'}
          </span>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-700">
          {/* Text Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Pencarian
            </label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Cari tugas kuliah..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                <option value="Sedang dikerjain...">Sedang Dikerjain...</option>
                <option value="Selesai">Selesai</option>
                <option value="Tertunda">Tertunda</option>
              </select>
            </div>

            {/* Mata Kuliah Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mata Kuliah
              </label>
              <select
                value={localFilters.mataKuliah}
                onChange={(e) => handleFilterChange('mataKuliah', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Mata Kuliah</option>
                {mataKuliahOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Filter - Fixed untuk nilai numerik */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Progress
              </label>
              <select
                value={localFilters.progress}
                onChange={(e) => handleFilterChange('progress', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Progress</option>
                <option value="0">0% (Belum Dimulai)</option>
                <option value="1-10">1-10%</option>
                <option value="11-25">11-25%</option>
                <option value="26-50">26-50%</option>
                <option value="51-75">51-75%</option>
                <option value="76-99">76-99%</option>
                <option value="100">100% (Selesai)</option>
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Deadline
              </label>
              <select
                value={localFilters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Deadline</option>
                <option value="today">Hari Ini</option>
                <option value="tomorrow">Besok</option>
                <option value="lusa">Lusa</option>
                <option value="thisWeek">Minggu Ini</option>
                <option value="nextWeek">Minggu Depan</option>
                <option value="thisMonth">Bulan Ini</option>
                <option value="nextMonth">Bulan Depan</option>
                <option value="twoMonths">2 Bulan</option>
                <option value="threeMonths">3 Bulan</option>
                <option value="overdue">Terlambat</option>
              </select>
            </div>

            {/* Tingkat Kesulitan Filter (ganti prioritas) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={localFilters.tingkatKesulitan}
                onChange={(e) => handleFilterChange('tingkatKesulitan', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Tingkat</option>
                <option value="Not Available">Not Available</option>
                <option value="Damai">Damai</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
                <option value="Ngeri ☠️">Ngeri ☠️</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md flex items-center"
            >
              <FaTimes className="mr-1" /> Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;