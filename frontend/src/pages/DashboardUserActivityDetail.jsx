import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getActivityTypeColor } from "../utils/activityHelpers";
import { formatDetails } from "../utils/formatActivityHelpers";

const DashboardUserActivityDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();

  const fetchUserActivities = async (pageNum = 1, append = false) => {
    try {
      const token = localStorage.getItem("token");

      // Fetch user details first (only on initial load)
      if (pageNum === 1 && !userData) {
        const userResponse = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);
      }

      // Set loading state based on whether we're loading the first page or more
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Fetch user activities with pagination
      const activitiesResponse = await api.get(`/activities/user/${userId}?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (append) {
        setActivities(prev => [...prev, ...activitiesResponse.data.activities]);
      } else {
        setActivities(activitiesResponse.data.activities);
      }
      
      setHasMore(pageNum < activitiesResponse.data.totalPages);
    } catch (err) {
      console.error("Error fetching user activities:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Data",
        text: "There was an error retrieving the user's activity data.",
        background: "#1F2937",
        color: "#F3F4F6",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, [userId]);

  // Load more data when scrolling to the last element
  const lastActivityElementRef = useCallback(
    (node) => {
      if (isLoading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            fetchUserActivities(nextPage, true);
            return nextPage;
          });
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, loadingMore, hasMore]
  );

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 mr-4 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-3xl font-bold text-white border-b-2 border-blue-500 pb-1">
            User Activity Log
          </h1>
        </div>

        {/* User Info Card */}
        {userData && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-full mr-4">
                <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {userData.name}
                </h2>
                <p className="text-gray-400">
                  @{userData.username} • {userData.email}
                </p>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      userData.isActive ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {userData.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="ml-2 bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-xs">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
              No activities found for this user.
            </p>
            <p className="text-gray-400 mt-2">
              This user hasn't performed any tracked actions yet.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faHistory}
                  className="text-blue-400 mr-2"
                />
                <h2 className="text-xl font-medium text-white">
                  Activity History
                </h2>
              </div>
              <div className="text-gray-400 text-sm">
                Showing activities (scroll to load more)
              </div>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="py-3 px-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-2"
                        />
                        Timestamp
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
                      ref={index === activities.length - 1 ? lastActivityElementRef : null}
                      className={
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }
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
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityTypeColor(
                            activity.type
                          )} text-white`}
                        >
                          {activity.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm max-w-xs truncate">
                        <Link
                          to={activity.path}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono hover:underline"
                        >
                          {activity.path}
                        </Link>
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
              
              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <div className="flex justify-center items-center p-4 bg-gray-800 border-t border-gray-700">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-blue-400 mr-2" />
                  <span className="text-gray-400">Loading more activities...</span>
                </div>
              )}
              
              {/* End of results message */}
              {!isLoading && !loadingMore && !hasMore && activities.length > 0 && (
                <div className="text-center p-4 text-gray-400 border-t border-gray-700">
                  End of activity logs
                </div>
              )}
            </div>

            {/* Activity Summary */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">
                Activity Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(
                  activities.reduce((acc, activity) => {
                    acc[activity.type] = (acc[activity.type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div
                    key={type}
                    className="bg-gray-700 rounded-lg p-4 text-center"
                  >
                    <div
                      className={`inline-block px-3 py-1 rounded-full ${getActivityTypeColor(
                        type
                      )} text-white text-xs mb-2`}
                    >
                      {type}
                    </div>
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-xs text-gray-400">activities</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardUserActivityDetail;