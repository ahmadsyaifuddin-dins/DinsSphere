// utils/helpers.js
export const getStatusBadgeClass = (status) => {
    const statusConfig = {
      "Belum Dikerjakan": "bg-red-500",
      "Sedang dikerjain...": "bg-blue-500",
      "Tertunda": "bg-purple-500",
      Selesai: "bg-green-500",
      "Menunggu Review": "bg-indigo-500",
      Revisi: "bg-yellow-500",
    };
    return statusConfig[status] || "bg-gray-500";
  };
  
  export const getProgressColorClass = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  export const getRemainingDays = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  