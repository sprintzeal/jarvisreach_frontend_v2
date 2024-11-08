import React from "react";
import Chart from "react-apexcharts";

const LineChart = ({ graphData, totalSalesLoading }) => {
  // Check if graphData exists and has the necessary structure
  const graphArray = graphData?.result?.graphData;
  if (!totalSalesLoading && (!graphArray || graphArray.length === 0)) {
    return <p>No data available for the chart.</p>;
  }

  // Extract dates and plan data
  const dates = graphArray?.map((data) => Object.keys(data)[0]);
  const planNames =
    dates?.length > 0 ? Object?.keys(graphArray[0][dates[0]]) : [];

  const seriesData = planNames?.map((planName) => {
    return {
      name: planName,
      data: dates.map(
        (date) => graphArray?.find((data) => data[date])[date][planName]
      ),
    };
  });

  function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  }

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: dates?.map((date) =>
      {
      return  formatDate(new Date(date).toLocaleDateString("en-US"))
      }
      ),
      title: {
        text: "",
      },
      labels: {
        style: {
          colors: "#000",
          fontSize: "12px",
          display: "none",
        },
      },
    },
    yaxis: {
      title: {
        text: "",
      },
      labels: {
        style: {
          colors: "#000",
          fontSize: "12px",
          display: "none",
        },
      },
    },
    markers: {
      size: 4,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "dark",
    },
    plotOptions: {
      line: {
        colors: ["#000"], // Line color
      },
    },
    fill: {
      type: "solid", // Ensure solid fill type
      opacity: 0.4, // Adjust the opacity of the fill
      colors: ["#00FF00"], // Specify fill color (optional, override by series color)
    },
  };
  return (
    <div>
      <Chart options={chartOptions} series={seriesData} type="line" />
    </div>
  );
};

export default LineChart;
