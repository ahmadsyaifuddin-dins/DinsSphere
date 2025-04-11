import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // import Link
import api from "../services/api";
import Swal from "sweetalert2";

const DashboardActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      // Pastikan endpoint ini mengarah ke GET /api/activities/all
      const res = await api.get("/activities/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching detailed activities:", err);
      Swal.fire("Error", "Failed to fetch activities.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard Activity Detail</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : activities.length === 0 ? (
        <div>No activities found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Activity Type</th>
                <th className="py-2 px-4 border-b">Path</th>
                <th className="py-2 px-4 border-b">Task ID</th>
                <th className="py-2 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="py-2 px-4 border-b">
                    {new Date(activity.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {activity.userId && activity.userId.name ? (
                      <Link
                        to={`/dashboardActivity/user/${activity.userId._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {activity.userId.name}
                      </Link>
                    ) : (
                      "Guest"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{activity.type}</td>
                  <td className="py-2 px-4 border-b">{activity.path}</td>
                  <td className="py-2 px-4 border-b">
                    {activity.taskId ? activity.taskId : "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {activity.details ? JSON.stringify(activity.details) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardActivity;
