import React from "react";

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

