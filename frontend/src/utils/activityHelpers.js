// src/utils/activityHelpers.js

// Helper untuk menentukan warna berdasarkan tipe aktivitas
export const getActivityTypeColor = (type) => {
    const types = {
      LOGIN: "bg-green-600",
      LOGOUT: "bg-yellow-600",
      CREATE: "bg-blue-600",
      UPDATE: "bg-purple-600",
      DELETE: "bg-red-600",
      PAGE_VIEW: "bg-indigo-600",
      TASK_VIEW: "bg-pink-600",
    };
  
    return types[type] || "bg-gray-600";
  };
  
  export const getActivityTypeIcon = (type) => {
    const types = {
      LOGIN: faUserPlus,
      LOGOUT: faUserMinus,
      CREATE: faPlus,
      UPDATE: faEdit,
      DELETE: faTrash,
      PAGE_VIEW: faList,
      TASK_VIEW: faInfoCircle,
    };
  
    return types[type] || faQuestionCircle;
  };

  export const getActivityTypeLabel = (type) => {
    const types = {
      LOGIN: "Login",
      LOGOUT: "Logout",
      CREATE: "Create",
      UPDATE: "Update",
      DELETE: "Delete",
      PAGE_VIEW: "Page View",
      TASK_VIEW: "Task View",
    };
  
    return types[type] || "Unknown";
  };