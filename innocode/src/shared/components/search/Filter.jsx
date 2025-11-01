import React from "react";
import { Icon } from "@iconify/react";
import "./Filter.css";

const Filter = ({ 
  selectedFilter, 
  onFilterRemove, 
  className = "",
  label = "All Contests"
}) => {
  if (!selectedFilter) return null;

  return (
    <div className={`filter-container ${className}`}>
      <div className="filter-chip">
        <span className="filter-label">{label}</span>
        <button 
          className="filter-remove"
          onClick={onFilterRemove}
        >
          <Icon icon="material-symbols:close" />
        </button>
      </div>
    </div>
  );
};

export default Filter;
