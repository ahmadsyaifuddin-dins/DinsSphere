// TugasKuliah.jsx
import React from "react";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";
import FilterPanel from "../components/tugas_kuliah/Filtering/FilterPanel";
import SortOrder from "../components/tugas_kuliah/Filtering/SortOrder";
import ViewMode from "../components/tugas_kuliah/Filtering/ViewMode";
import TugasKuliahList from "../components/tugas_kuliah/TugasKuliahList";
import TugasKuliahCard from "../components/tugas_kuliah/TugasKuliahCard";
import TugasKuliahModal from "../components/tugas_kuliah/TugasKuliahModal";
import TugasListSkeleton from "../loader/TugasListSkeleton";
import AuthOverlay from "../components/tugas_kuliah/AuthOverlay";
import { useTugasKuliah } from "../hooks/useTugasKuliah";
import {
  getProgressColorClass,
  getStatusColorClass,
  mataKuliahOptions,
} from "../utils/helpers";

const TugasKuliah = () => {
  const {
    // States
    isLoading,
    isLoadingViewCounts,
    isInitializing,
    isModalOpen,
    viewMode,
    filterText,
    filters,
    sortOrder,
    tugasToEdit,
    processedTasks,
    tugasKuliah,
    isAdmin,
    
    // State setters
    setIsModalOpen,
    setViewMode,
    setFilterText,
    setFilters,
    setSortOrder,
    setTugasToEdit,
    
    // Action handlers
    viewTaskDetail,
    handleDelete,
    handleEdit,
    handleSave,
    handleOrderChange,
    applyFilters,
  } = useTugasKuliah();

  // Show loading state until authentication check is complete
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex items-center justify-center">
        <div className="animate-pulse">
          <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Display auth overlay if user is not admin */}
      <AuthOverlay isAdmin={isAdmin} />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
          <HeaderTugasKuliah
            isAdmin={isAdmin}
            setTugasToEdit={setTugasToEdit}
            setIsModalOpen={setIsModalOpen}
          />

          {/* Tugas Count */}
          <div className="mb-4 mt-2 flex justify-between items-center">
            <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-lg">
              <span className="font-medium">
                Total Tugas: {tugasKuliah.length}
              </span>
            </div>
            <div className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500 rounded-lg">
              <span className="font-medium">
                Hasil Filter: {processedTasks.length}
              </span>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filterText={filterText}
            setFilterText={setFilterText}
            mataKuliahOptions={mataKuliahOptions}
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
          />

          {/* Sort & View Controls */}
          <div className="flex justify-between items-center mb-4">
            <SortOrder
              sortOrder={sortOrder}
              setSortOrder={(val) => {
                setSortOrder(val);
              }}
            />
            <ViewMode viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {/* Render Tasks */}
          {isLoading ? (
            <TugasListSkeleton />
          ) : processedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {filterText ||
              Object.values(filters).some((value) => value !== "")
                ? "Tidak ada tugas yang sesuai dengan filter. Coba ubah filter Anda."
                : "Gak ada Tugas!"}
            </div>
          ) : viewMode === "list" ? (
            <TugasKuliahList
              tasks={processedTasks}
              getStatusColorClass={getStatusColorClass}
              getProgressColorClass={getProgressColorClass}
              viewTaskDetail={viewTaskDetail}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isAdmin={isAdmin}
              onOrderChange={handleOrderChange}
              mataKuliahOptions={mataKuliahOptions}
              isLoadingViewCounts={isLoadingViewCounts}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {processedTasks.map((task) => (
                <TugasKuliahCard
                  key={task._id}
                  task={task}
                  viewTaskDetail={viewTaskDetail}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isAdmin={isAdmin}
                  isLoadingViewCounts={isLoadingViewCounts}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tugas Modal */}
        {isModalOpen && isAdmin && (
          <TugasKuliahModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setTugasToEdit(null);
            }}
            task={tugasToEdit}
            onSave={handleSave}
            mataKuliahOptions={mataKuliahOptions}
          />
        )}
      </div>
    </div>
  );
};

export default TugasKuliah;