import React, { useState } from "react";
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const DateRange = ({ dateRange, setDateRange }) => {
  const revenueColors = ["#f1556c"];
  const salesColors = ["#1abc9c", "#4a81d4"];

  return (
    <div>
      <Flatpickr
        options={{
          altInput: true,
          mode: "range",
          altFormat: "F j, Y",
          defaultDate: "today",
          maxDate: new Date(),
        }}
        value={dateRange?.length > 0 ? dateRange : [new Date(), new Date()]}
        onChange={(dates) => setDateRange(dates)}
      />
    </div>
  );
};

export default DateRange;
