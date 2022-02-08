import { StatusFilters } from "../filters/filterSlice";
interface StatusFilterProps {
  value: string;
  onChange: (status: string) => void;
}

const StatusFilter = ({ value: status, onChange }: StatusFilterProps) => {
  function getValue(key: string): string {
    if (key === "ALL") return "all";
    else if (key === "ACTIVE") return "active";
    else if (key === "COMPLETED") return "completed";
    else
      throw new Error(
        `Error getting status filter, got ${key} but expected ALL, ACTIVE or COMPLETED}`
      );
  }
const renderedFilters = Object.keys(StatusFilters).map((key) => {
    // const value = StatusFilters[key];
    const value = getValue(key);

    const handleClick = () => onChange(value);
    const className = value === "status" ? "selected" : "";

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    );
  });

  return (
    <div className="filters statusFilters">
      <h5>Filter by status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  );
};

export default StatusFilter;import React from "react";

