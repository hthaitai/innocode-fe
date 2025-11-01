import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./Search.css";

const Search = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  value,
  onChange,
  filterType = "all",
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue, filterType);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue, filterType);
    }
  };

  return (
    <div className={`search-container ${className}`}>
      <div className="search-bar">
        <Icon
          icon="material-symbols:search"
          className="search-icon"
          onClick={handleSearchClick}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          className="search-input"
          {...props}
        />
      </div>
    </div>
  );
};

export default Search;
