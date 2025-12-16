import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetActivityLogsQuery } from "@/services/activityLogApi";
import { formatDateTime } from "@/shared/utils/dateTime";
import "./ActivityLog.css";

const ActivityLog = () => {
  const [page] = useState(1);
  const [pageSize] = useState(1000); // Load tất cả logs
  const [filters, setFilters] = useState({
    actionContains: "",
    targetType: "",
    userId: "",
  });
  
  const {
    data: logsData,
    isLoading,
    error,
    refetch,
  } = useGetActivityLogsQuery(
    {
      page,
      pageSize,
      actionContains: filters.actionContains || undefined,
      targetType: filters.targetType || undefined,
      userId: filters.userId || undefined,
      sortBy: "at",
      desc: true,
    },
    {
      pollingInterval: 30000, // Auto-refresh every 30 seconds
    }
  );

  const logs = logsData?.items || [];
  const totalCount = logsData?.totalCount || 0;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getActionIcon = (action) => {
    if (!action) return "mdi:information-outline";
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add"))
      return "mdi:plus-circle";
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "mdi:pencil";
    if (actionLower.includes("delete") || actionLower.includes("remove"))
      return "mdi:delete";
    if (actionLower.includes("login") || actionLower.includes("auth"))
      return "mdi:login";
    if (actionLower.includes("logout")) return "mdi:logout";
    if (actionLower.includes("view") || actionLower.includes("read"))
      return "mdi:eye";
    return "mdi:information-outline";
  };

  const getActionColor = (action) => {
    if (!action) return "var(--color-info)";
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add"))
      return "var(--color-success)";
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "var(--color-warning)";
    if (actionLower.includes("delete") || actionLower.includes("remove"))
      return "var(--color-danger)";
    if (actionLower.includes("login") || actionLower.includes("auth"))
      return "var(--color-primary)";
    return "var(--color-info)";
  };

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <div className="activity-log-title-section">
          <Icon icon="mdi:history" width="24" className="activity-log-icon" />
          <h2 className="activity-log-title">Activity Logs</h2>
          {totalCount > 0 && (
            <span className="activity-log-count">({totalCount})</span>
          )}
        </div>
        <button
          className="activity-log-refresh-btn"
          onClick={() => refetch()}
          title="Refresh"
        >
          <Icon icon="mdi:refresh" width="20" />
        </button>
      </div>

      {/* Filters */}
      <div className="activity-log-filters">
        <div className="activity-log-filter-group">
          <label htmlFor="actionFilter">Action:</label>
          <input
            id="actionFilter"
            type="text"
            placeholder="Filter by action..."
            value={filters.actionContains}
            onChange={(e) => handleFilterChange("actionContains", e.target.value)}
            className="activity-log-filter-input"
          />
        </div>
        <div className="activity-log-filter-group">
          <label htmlFor="targetTypeFilter">Target Type:</label>
          <input
            id="targetTypeFilter"
            type="text"
            placeholder="Filter by target type..."
            value={filters.targetType}
            onChange={(e) => handleFilterChange("targetType", e.target.value)}
            className="activity-log-filter-input"
          />
        </div>
        <div className="activity-log-filter-group">
          <label htmlFor="userIdFilter">User ID:</label>
          <input
            id="userIdFilter"
            type="text"
            placeholder="Filter by user ID..."
            value={filters.userId}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
            className="activity-log-filter-input"
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="activity-log-list">
        {isLoading ? (
          <div className="activity-log-loading">
            <Icon icon="mdi:loading" width="24" className="spinning" />
            <span>Loading activity logs...</span>
          </div>
        ) : error ? (
          <div className="activity-log-error">
            <Icon icon="mdi:alert-circle-outline" width="24" />
            <span>Error loading activity logs</span>
            <button
              className="activity-log-retry-btn"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="activity-log-empty">
            <Icon icon="mdi:history-off" width="48" />
            <span>No activity logs found</span>
          </div>
        ) : (
          logs.map((log) => {
            const actionIcon = getActionIcon(log.action);
            const actionColor = getActionColor(log.action);
            const timestamp = log.at || log.timestamp || log.createdAt || log.dateTime;

            return (
              <div key={log.logId || log.id || log.activityLogId} className="activity-log-item">
                <div
                  className="activity-log-icon-wrapper"
                  style={{ color: actionColor }}
                >
                  <Icon icon={actionIcon} width="20" />
                </div>
                <div className="activity-log-content">
                  <div className="activity-log-main">
                    <span className="activity-log-action">{log.action || "Unknown Action"}</span>
                    {log.userId && (
                      <span className="activity-log-user">
                        User: {log.userId}
                      </span>
                    )}
                  </div>
                  <div className="activity-log-details">
                    {log.targetType && (
                      <span className="activity-log-target-type">
                        {log.targetType}
                      </span>
                    )}
                    {log.targetId && (
                      <span className="activity-log-target-id">
                        Target ID: {log.targetId}
                      </span>
                    )}
                  </div>
                  <div className="activity-log-meta">
                    {timestamp && (
                      <span className="activity-log-time">
                        <Icon icon="mdi:clock-outline" width="14" />
                        {formatDateTime(timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show total count if all logs are loaded */}
      {logs.length > 0 && (
        <div className="activity-log-footer">
          <span className="activity-log-total-info">
            Display {logs.length} / {totalCount} logs
          </span>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

