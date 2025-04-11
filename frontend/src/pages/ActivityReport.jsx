import React, { useState, useEffect } from "react";
import api from "../services/api";

const ActivityReport = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
        const token = localStorage.getItem("token");
      try {
        const res = await api.get("/activities/report?period=today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Activity Report (Today)</h1>
      {report.length === 0 ? (
        <p>No activity data available.</p>
      ) : (
        <ul>
          {report.map(item => (
            <li key={item._id}>
              <strong>{item._id}:</strong> {item.count} times
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityReport;
