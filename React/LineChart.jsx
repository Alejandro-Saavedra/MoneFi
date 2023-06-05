import React from "react";
import ApexCharts from "./ApexCharts";
import { useState } from "react";
import debug from "sabio-debug";
import { useEffect } from "react";
import PropTypes from "prop-types";

const _logger = debug.extend("GData");

const LineChart = ({ responseData }) => {
  const [dateLabel, setDateLabel] = useState([]);
  const [lineData, setLineData] = useState({
    lineData: [
      {
        name: "Avg Duration",
        data: [],
        colors: ["#754ffe"],
      },
      {
        name: "Users",
        data: [],
      },
    ],
  });

  const [updatedSessionOptions, setUpdatedSessionOptions] = useState({
    chart: {
      toolbar: { show: !1 },
      height: 200,
      type: "line",
      zoom: { enabled: !1 },
    },
    dataLabels: { enabled: !1 },
    stroke: { width: [4, 3, 3], curve: "smooth", dashArray: [0, 5, 4] },
    legend: { show: !1 },
    colors: ["#754ffe", "#19cb98", "#ffaa46"],
    markers: { size: 0, hover: { sizeOffset: 6 } },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan",
        "08 Jan",
        "09 Jan",
        "10 Jan",
        "11 Jan",
        "12 Jan",
      ],
      labels: {
        style: {
          colors: ["#5c5776"],
          fontSize: "12px",
          fontFamily: "Inter",
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#5c5776"],
          fontSize: "14px",
          fontFamily: "Inter",
          cssClass: "apexcharts-xaxis-label",
        },
        offsetX: -12,
        offsetY: 0,
      },
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (e) {
              return e + " (mins)";
            },
          },
        },
        {
          title: {
            formatter: function (e) {
              return e + " per session";
            },
          },
        },
        {
          title: {
            formatter: function (e) {
              return e;
            },
          },
        },
      ],
    },
    grid: { borderColor: "#f1f1f1" },
    responsive: [
      { breakpoint: 480, options: { chart: { height: 300 } } },
      { breakpoint: 1441, options: { chart: { height: 360 } } },
      { breakpoint: 1980, options: { chart: { height: 400 } } },
      { breakpoint: 2500, options: { chart: { height: 470 } } },
      { breakpoint: 3000, options: { chart: { height: 450 } } },
    ],
  });

  _logger("dateLabel:", dateLabel);

  const mapLineData = (data) => {
    const date = data.dimensions[0];
    const avgSessionDurationSeconds = parseFloat(data.metrics[0].values[0]);
    const avgSessionDurationMinutes = parseFloat(
      (avgSessionDurationSeconds / 60).toFixed(2)
    );
    const userValues = parseInt(data.metrics[0].values[1]);

    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    return {
      dateLabel,
      avgSessionDurationMinutes,
      userValues,
    };
  };

  useEffect(() => {
    if (responseData) {
      const newData = responseData.map(mapLineData);

      setLineData((prevState) => {
        const newLine = { ...prevState };
        newLine.lineData[0].data = newData.map(
          (data) => data.avgSessionDurationMinutes
        );
        newLine.lineData[1].data = newData.map((data) => data.userValues);
        return newLine;
      });

      setDateLabel((prevState) => {
        var newDates = [...prevState];
        newDates = newData.map((data) => data.dateLabel);
        return newDates;
      });

      setUpdatedSessionOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: newData.map((data) => data.dateLabel.slice(8, 10)),
        },
      }));
    }
  }, [responseData]);

  return (
    <ApexCharts
      options={updatedSessionOptions}
      series={lineData.lineData}
      type="line"
    />
  );
};

LineChart.propTypes = {
  responseData: PropTypes.arrayOf(
    PropTypes.shape({
      sessions: PropTypes.number,
    })
  ),
};

export default LineChart;
