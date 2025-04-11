// src/pages/DashboardUserActivityDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const DashboardUserActivityDetail = () => {
  const { userId } = useParams(); // pastikan route lo menyediakan userId
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/activities/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching user activities:", err);
      Swal.fire("Error", "Failed to fetch activities.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, [userId]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detail Activity for User ID: {userId}</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : activities.length === 0 ? (
        <div>No activities found for this user.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Timestamp</th>
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

export default DashboardUserActivityDetail;
