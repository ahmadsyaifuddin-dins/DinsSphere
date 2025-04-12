import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faSpinner,
  faUser,
  faCode,
  faLink,
  faList,
  faInfoCircle,
  faCalendarAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const DashboardActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/activities/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching detailed activities:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Activities",
        text: "There was an error retrieving the activity data.",
        background: "#1F2937",
        color: "#F3F4F6",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Helper to get appropriate color for activity type
  const getActivityTypeColor = (type) => {
    const types = {
      LOGIN: "bg-green-600",
      LOGOUT: "bg-yellow-600",
      CREATE: "bg-blue-600",
      UPDATE: "bg-purple-600",
      DELETE: "bg-red-600",
      VIEW: "bg-indigo-600",
    };

    return types[type] || "bg-gray-600";
  };

  // Helper to format JSON details nicely
  const formatDetails = (details) => {
    if (!details) return "-";
    try {
      const parsed =
        typeof details === "object" ? details : JSON.parse(details);
      const keys = Object.keys(parsed);

      if (keys.length === 0) return "-";

      return (
        <div className="max-w-xs overflow-hidden text-xs">
          {keys.map((key) => (
            <div key={key} className="truncate">
              <span className="font-medium text-blue-400">{key}:</span>{" "}
              <span className="text-gray-300">
                {JSON.stringify(parsed[key]).substring(0, 30)}
              </span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return String(details).substring(0, 50);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faHistory}
              className="text-blue-400 text-3xl mr-4"
            />
            <h1 className="text-3xl font-bold text-white">
              Activity Dashboard
            </h1>
          </div>
          <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">
            System Logs
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-400 text-4xl mb-4"
            />
            <p className="text-gray-400">Loading activity data...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-yellow-500 text-4xl mb-4"
            />
            <p className="text-xl text-gray-300">
              No activities found in the system.
            </p>
            <p className="text-gray-400 mt-2">
              Activities will appear here once users start interacting with the
              system.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      Timestamp
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      User
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCode} className="mr-2" />
                      Activity Type
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faLink} className="mr-2" />
                      Path
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faList} className="mr-2" />
                      Mata Kuliah
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Details
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {activities.map((activity, index) => (
                  <tr
                    key={activity._id}
                    className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-sm">
                      <div className="font-medium">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {activity.userId && activity.userId.name ? (
                        <Link
                          to={`/dashboardActivity/user/${activity.userId._id}`}
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          <div className="bg-blue-900 p-1 rounded-full mr-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-xs"
                            />
                          </div>
                          <span className="hover:underline">
                            {activity.userId.name}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-gray-400 italic">Guest</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityTypeColor(
                          activity.type
                        )} text-white`}
                      >
                        {activity.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-xs truncate">
                      <a
                        href={activity.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono hover:text-blue-400 hover:underline"
                      >
                        {activity.path}
                      </a>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                      {activity.taskId && activity.taskId.mataKuliah ? (
                        <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">
                          {activity.taskId.mataKuliah}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      <div className="bg-gray-700 rounded p-2">
                        {formatDetails(activity.details)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardActivity;
