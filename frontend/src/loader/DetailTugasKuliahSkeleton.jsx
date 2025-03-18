import React from 'react'

const DetailTugasKuliahSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6 animate-pulse">
          {/* Skeleton Header */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          </div>
          {/* Skeleton Progress Bar */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
          </div>
          {/* Skeleton Dates */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
          {/* Skeleton Deskripsi */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/4"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
  )
}

export default DetailTugasKuliahSkeleton