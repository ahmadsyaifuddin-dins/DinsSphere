import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  RefreshCcw,
  AlertCircle,
  Calendar,
  ChevronDown,
} from "lucide-react";

const ActivityReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("today");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  const fetchReport = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await api.get(`/activities/report?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Unable to load activity data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period]);

  // Transform data for chart display
  const chartData = report.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  // Get title based on current period
  const getPeriodTitle = () => {
    const periodObj = periods.find((p) => p.value === period);
    return periodObj ? periodObj.label : "Activity Report";
  };

  return (
    <div className="bg-slate-950 rounded-lg shadow-lg overflow-hidden text-white">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity className="text-blue-400" size={20} />
          <h2 className="text-xl font-semibold">
            Activity Report ({getPeriodTitle()})
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded text-sm transition-colors"
            >
              <Calendar size={14} className="text-blue-400" />
              <span className="hidden sm:inline">{getPeriodTitle()}</span>
              <span className="sm:hidden">Today</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-slate-800 rounded shadow-xl z-10">
                <ul className="py-1">
                  {periods.map((p) => (
                    <li key={p.value}>
                      <button
                        className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors ${
                          period === p.value ? "bg-blue-600" : ""
                        }`}
                        onClick={() => {
                          setPeriod(p.value);
                          setDropdownOpen(false);
                        }}
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={fetchReport}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-1.5 rounded text-sm"
            aria-label="Refresh data"
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <AlertCircle size={24} className="mb-2 text-red-400" />
            <p>{error}</p>
          </div>
        ) : report.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <AlertCircle size={24} className="mb-2" />
            <p>No activity data available for this period.</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Activity Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-700/40 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-medium">
                        {item._id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Activity Type
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-blue-400 font-bold text-xl">
                        {item.count}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.count === 1 ? "occurrence" : "occurrences"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/20 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Most Frequent</div>
                <div className="font-bold text-lg text-white">
                  {report.length > 0
                    ? report.reduce((prev, current) =>
                        prev.count > current.count ? prev : current
                      )._id
                    : "N/A"}
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-400/20 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">
                  Total Activities
                </div>
                <div className="font-bold text-lg text-white">
                  {report.reduce((sum, item) => sum + item.count, 0)}
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">
                  Activity Types
                </div>
                <div className="font-bold text-lg text-white">
                  {report.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span>Period: {getPeriodTitle()}</span>
      </div>
    </div>
  );
};

export default ActivityReport;
