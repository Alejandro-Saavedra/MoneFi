import React, { Fragment, useState } from "react";
import { Card, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import ApexCharts from "./ApexCharts";
import { useEffect } from "react";

const BarChart = ({ responseData, maxUniqueUsers }) => {
  const [barData, setBarData] = useState({
    names: ["Total Sessions", "Unique Users"],
    data: [
      {
        name: "Total Sessions",
        data: [],
      },
      {
        name: "Unique Users",
        data: [],
      },
    ],
    dateLabel: [],
  });

  const [userCount, setUserCount] = useState({
    totalSessions: 0,
    uniqueUsers: 0,
  });

  const [ActiveUserChartOptions, setActiveUserOptions] = useState({
    chart: { type: "bar", height: 302, sparkline: { enabled: !0 } },
    states: {
      normal: { filter: { type: "none", value: 0 } },
      hover: { filter: { type: "darken", value: 0.55 } },
      active: {
        allowMultipleDataPointsSelection: !1,
        filter: { type: "darken", value: 0.55 },
      },
    },
    colors: ["#8968fe", "#90EE90"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    xaxis: { crosshairs: { width: 1 } },
    tooltip: {
      fixed: { enabled: !1 },
      x: { show: !1 },
      y: {
        title: {
          formatter: function (seriesName) {
            if (seriesName === "Total Sessions") {
              return "Total Sessions";
            } else if (seriesName === "Unique Users") {
              return "Unique Users";
            }
            return seriesName;
          },
        },
      },
      marker: { show: !1 },
    },
    responsive: [
      { breakpoint: 480, options: { chart: { height: 300 } } },
      { breakpoint: 1441, options: { chart: { height: 300 } } },
      { breakpoint: 1981, options: { chart: { height: 300 } } },
      { breakpoint: 2500, options: { chart: { height: 400 } } },
      { breakpoint: 3000, options: { chart: { height: 450 } } },
    ],
  });

  const mapUniqueUsers = (data) => {
    const date = data.dimensions[0];
    const sessions = parseInt(data.metrics[0].values[0]);
    const uniqueUsers = parseInt(data.metrics[0].values[1]);
    const newUsers = parseInt(data.metrics[0].values[2]);
    const userType = data.dimensions[2];

    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    return {
      dateLabel,
      sessions,
      uniqueUsers,
      newUsers,
      userType,
    };
  };

  useEffect(() => {
    if (responseData) {
      const newUsers = responseData.map(mapUniqueUsers);
      const uniqueDates = new Set();

      setBarData((prevState) => {
        const newBarData = { ...prevState };
        newBarData.data[0].data = [];
        newBarData.data[1].data = [];
        newBarData.dateLabel = [];

        newUsers.forEach((user) => {
          if (!uniqueDates.has(user.dateLabel)) {
            uniqueDates.add(user.dateLabel);
            newBarData.dateLabel.push(user.dateLabel);
            newBarData.data[0].data.push(user.sessions);
            newBarData.data[1].data.push(user.uniqueUsers);
          } else {
            const index = newBarData.dateLabel.indexOf(user.dateLabel);
            newBarData.data[0].data[index] += user.sessions;
          }
        });
        return newBarData;
      });

      setUserCount((prevState) => {
        const newUserData = { ...prevState };
        newUserData.totalSessions = 0;
        newUserData.uniqueUsers = maxUniqueUsers.uniqueUsers;

        newUsers.forEach((user) => {
          newUserData.totalSessions += user.sessions;
        });
        return newUserData;
      });

      setActiveUserOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: newUsers.map((data) => data.dateLabel.slice(5, 10)),
        },
      }));
    }
  }, [responseData]);

  return (
    <Fragment>
      <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Active Users</h4>
      </Card.Header>
      <Card.Body>
        <Col>
          <span className="fw-semi-bold">Total Sessions</span>
          <h1 className="fw-bold mt-2 mb-0 h2">{userCount.totalSessions}</h1>
          <p className="text-danger fw-semi-bold mb-0"></p>
        </Col>
        <Col>
          <span className="fw-semi-bold">Unique Users</span>
          <h1 className="fw-bold mt-2 mb-0 h2">{userCount.uniqueUsers}</h1>
          <p className="text-danger fw-semi-bold mb-0"></p>
        </Col>
        <ApexCharts
          options={ActiveUserChartOptions}
          series={barData.data}
          type="bar"
        />
      </Card.Body>
    </Fragment>
  );
};

BarChart.propTypes = {
  responseData: PropTypes.arrayOf(
    PropTypes.shape({
      sessions: PropTypes.number,
    })
  ),
  maxUniqueUsers: PropTypes.shape({
    totalSessions: PropTypes.number,
    uniqueUsers: PropTypes.number,
  }),
};

export default BarChart;
