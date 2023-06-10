import React, { useMemo } from "react";
import { Fragment, useState, useEffect } from "react";
import { Col, Row, Card, Container, InputGroup } from "react-bootstrap";
import MostViewPages from "./MostViewPages";
import Browsers from "./Browsers";
import AnalyticsView from "./AnalyticsViewComponent";
import debug from "debug";
import * as GoogleAnalytics from "../../../services/analyticsService";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Field, ErrorMessage, Form as FormikForm } from "formik";
import analyticsDatePickSchema from "schemas/analyticsDatePickSchema";
import toastr from "toastr";
import DonutChart from "./DonutChart";
import "toastr/build/toastr.min.css";
import "./analytics.css";
import LocationCard from "./LocationCard";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
const _logger = debug.extend("GData");

const Analytics = () => {
  const today = new Date(Date.now());
  const oneWeekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const [dates, setDates] = useState({
    startDate: oneWeekAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
  });

  const [hasDateChanged, setHasDateChanged] = useState(false);

  const payLoads = useMemo(() => ({
    viewsPayload: {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [
        { expression: "ga:avgSessionDuration" },
        { expression: "ga:users" },
      ],
      dimensions: [{ name: "ga:date" }],
    },
    locationsPayload: {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [{ expression: "ga:sessions" }],
      dimensions: [{ name: "ga:city" }, { name: "ga:country" }],
    },
    browserPayload: {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [{ expression: "ga:users" }],
      dimensions: [{ name: "ga:browser" }, { name: "ga:deviceCategory" }],
    },
    uniqueUsersPayload: {
      startDate: dates.startDate,
      endDate: dates.endDate,
      metrics: [
        { expression: "ga:sessions" },
        { expression: "ga:users" },
        { expression: "ga:newUsers" },
      ],
      dimensions: [
        { name: "ga:date" },
        { name: "ga:pagePath" },
        { name: "ga:userType" },
      ],
    },
  }));

  const [userCount, setUserCount] = useState({
    totalSessions: 0,
    uniqueUsers: 0,
  });

  const [pageViews, setPageViews] = useState({
    structure: {
      id: 0,
      link: "",
      views: 0,
    },
    pageData: [],
  });

  const [usersByLocation, setUsersByLocation] = useState({
    country: {},
    city: {},
  });

  const [browsersStatistics, setBrowsersStatistics] = useState({
    browsers: [],
    devices: [],
  });

  const [responseData, setReponseData] = useState([]);
  const [usersResponseData, setUsersResponseData] = useState([]);

  const [userType, setUserType] = useState({
    newVisitor: {
      label: "New Visitor",
      data: [0],
    },
    returningVisitor: {
      label: "Returning Visitor",
      data: [0],
    },
  });

  const runAnalyticServices = () => {
    setHasDataMapped({
      line: false,
      bar: false,
      location: false,
    });

    Promise.all([
      GoogleAnalytics.getAnalytics(
        payLoads.viewsPayload,
        dates.startDate,
        dates.endDate
      ),
      GoogleAnalytics.getAnalytics(
        payLoads.locationsPayload,
        dates.startDate,
        dates.endDate
      ),
      GoogleAnalytics.getAnalytics(
        payLoads.browserPayload,
        dates.startDate,
        dates.endDate
      ),
      GoogleAnalytics.getAnalytics(
        payLoads.uniqueUsersPayload,
        dates.startDate,
        dates.endDate
      ),
    ])
      .then(([viewsData, locationsData, browserData, uniqueUsersData]) => {
        onGetViewsSuccess(viewsData);
        onGetLocationsSuccess(locationsData);
        onGetBrowsersSuccess(browserData);
        onGetUniqueUsersSuccess(uniqueUsersData);
      })
      .catch((error) => {
        toastr.error("Retrieval failed", "Data");
        _logger(error);
      });

    setHasDateChanged(false);
  };

  const [settingDisplay, setSettingDisplay] = useState(false);
  const [chartView, setChartView] = useState({
    lineChart: true,
    barChart: true,
    usersByCity: true,
    mostViewPages: true,
    trafficChart: true,
    usersByCountry: false,
    browsers: false,
    devices: false,
  });

  const [hasDataMapped, setHasDataMapped] = useState({
    line: false,
    location: false,
    bar: false,
  });

  useEffect(() => {
    runAnalyticServices();
  }, []);

  useEffect(() => {
    if (hasDateChanged) {
      runAnalyticServices();
    }
  }, [dates, hasDateChanged]);

  const onGetViewsSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;
    setReponseData(responseData);
    setHasDateChanged(false);
  };

  const onGetLocationsSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;
    let newUsersByCountry = {};
    let newUsersByCity = {};

    responseData.forEach((location) => {
      const city = location.dimensions[0];
      const country = location.dimensions[1];
      const sessions = parseInt(location.metrics[0].values[0]);

      if (city !== "(not set)") {
        newUsersByCountry[country] = { sessions: sessions };
        newUsersByCity[city] = { sessions: sessions };
      }
    });

    setUsersByLocation((prevState) => {
      const newUsers = { ...prevState };
      newUsers.country = newUsersByCountry;
      newUsers.city = newUsersByCity;
      return newUsers;
    });

    setHasDataMapped((prevState) => {
      const mappedData = { ...prevState };
      mappedData.location = true;
      return mappedData;
    });
  };

  const onGetBrowsersSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;

    let totalUsers = 0;
    responseData.forEach((row) => {
      totalUsers += parseInt(row.metrics[0].values[0]);
    });

    const browsersStats = responseData.map((row) => {
      const browser = row.dimensions[0];
      const users = parseInt(row.metrics[0].values[0]);
      const percent = (users / totalUsers) * 100;

      return {
        browser: browser,
        percent: parseFloat(percent.toFixed(2)),
      };
    });

    let newDeviceStats = {};

    responseData.forEach((row) => {
      const device = row.dimensions[1];
      const users = parseInt(row.metrics[0].values[0]);

      if (newDeviceStats[device]) {
        newDeviceStats[device] += users;
      } else {
        newDeviceStats[device] = users;
      }
    });

    const deviceStats = Object.entries(newDeviceStats).map(
      ([device, users]) => {
        const percent = (users / totalUsers) * 100;

        return {
          device: device,
          percent: parseFloat(percent.toFixed(2)),
        };
      }
    );

    setBrowsersStatistics({
      browsers: browsersStats,
      devices: deviceStats,
    });
  };

  const mapUniqueUsers = (data) => {
    const date = data.dimensions[0];
    const sessions = parseInt(data.metrics[0].values[0]);
    const uniqueUsers = parseInt(data.metrics[0].values[1]);
    let pagePath = data.dimensions[1];
    const newUsers = parseInt(data.metrics[0].values[2]);
    const userType = data.dimensions[2];

    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const dateLabel = `${year}-${month}-${day}`;

    if (pagePath === "/") {
      pagePath = "/home";
    }

    return {
      dateLabel,
      sessions,
      uniqueUsers,
      pagePath,
      newUsers,
      userType,
    };
  };

  const onGetUniqueUsersSuccess = (response) => {
    const responseData = response.item.reports[0].data.rows;
    const maxUniqueUsers = parseInt(
      response.item.reports[0].data.maximums[0].values[1]
    );
    const newUsers = responseData.map(mapUniqueUsers);
    setUsersResponseData(response.item.reports[0].data.rows);

    setPageViews((prevState) => {
      let count = {};
      newUsers.forEach((user) => {
        if (!count[user.pagePath]) {
          count[user.pagePath] = {
            link: user.pagePath,
            views: user.sessions,
          };
        } else {
          count[user.pagePath].views += user.sessions;
        }
      });

      const pageDataArray = Object.values(count);
      const newPageViews = {
        ...prevState,
        pageData: [...pageDataArray],
      };
      return newPageViews;
    });

    setUserType((prevState) => {
      const newUserType = { ...prevState };
      newUserType.newVisitor.data[0] = 0;
      newUserType.returningVisitor.data[0] = 0;

      newUsers.forEach((user) => {
        if (user.userType === "New Visitor") {
          newUserType.newVisitor.data[0] += user.sessions;
        } else {
          newUserType.returningVisitor.data[0] += user.sessions;
        }
      });
      return newUserType;
    });

    setUserCount((prevState) => {
      const newUserData = { ...prevState };
      newUserData.uniqueUsers = maxUniqueUsers;
      newUsers.forEach((user) => {
        newUserData.totalSessions += user.sessions;
      });
      return newUserData;
    });

    setHasDateChanged(false);
  };

  const toggleView = () => {
    setSettingDisplay((prevState) => !prevState);
  };

  const handleChartViewChange = (updatedChartView) => {
    setChartView(updatedChartView);
  };

  const onDatePick = (values) => {
    setDates((prevState) => {
      const newDate = { ...prevState };
      const startDate = new Date(values.startDate);
      if (!isNaN(startDate)) {
        newDate.startDate = startDate.toISOString().substring(0, 10);
      }
      const endDate = new Date(values.endDate);
      if (!isNaN(endDate)) {
        newDate.endDate = endDate.toISOString().substring(0, 10);
      }
      return newDate;
    });
    setHasDateChanged(true);
  };

  const handleChange = (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    setFieldValue(fieldName, value);
    onDatePick({ [fieldName]: value });
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Analytics</h1>
            </div>
            <div className="d-flex">
              <div className="input-group me-3">
                <Formik
                  enableReinitialize={true}
                  initialValues={dates}
                  validationSchema={analyticsDatePickSchema}
                  className="formik-form"
                >
                  {({ setFieldValue }) => (
                    <FormikForm onSubmit={(e) => e.preventDefault}>
                      <Container>
                        <Row>
                          <Col className="px-1">
                            <Field
                              name="startDate"
                              className="form-control"
                              type="date"
                              min="2023-05-05"
                              max={dates.endDate}
                              onChange={(e) =>
                                handleChange(e, setFieldValue, "startDate")
                              }
                            ></Field>
                            <ErrorMessage
                              className="analytics-date-error"
                              name="startDate"
                              component="div"
                            />
                          </Col>
                          <Col className="px-1">
                            <Field
                              name="endDate"
                              className="form-control"
                              type="date"
                              min={dates.startDate}
                              max={today.toISOString().substring(0, 10)}
                              onChange={(e) =>
                                handleChange(e, setFieldValue, "endDate")
                              }
                            ></Field>
                            <ErrorMessage
                              className="analytics-date-error"
                              name="endDate"
                              component="div"
                            />
                          </Col>
                        </Row>
                      </Container>
                    </FormikForm>
                  )}
                </Formik>
              </div>
              <InputGroup className="btn-custom">
                {!settingDisplay ? (
                  <button onClick={toggleView} className="btn btn-primary">
                    Settings
                  </button>
                ) : (
                  <button onClick={toggleView} className="btn btn-success">
                    Close
                  </button>
                )}
              </InputGroup>
            </div>
          </div>
        </Col>
        <Col>
          <div className="ml-auto">
            {settingDisplay && (
              <AnalyticsView
                onChartViewChange={handleChartViewChange}
                chartView={chartView}
                toggleView={toggleView}
              />
            )}
          </div>
        </Col>
      </Row>
      <div className="d-flex flex-column justify-content-start">
        <Row>
          {chartView.lineChart && !hasDataMapped.line && (
            <Col xl={8} lg={12} md={12} className="mb-4">
              <Card className="h-100">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Average Duration per Session</h4>
                </Card.Header>
                <Card.Body>
                  {responseData &&
                    responseData.length > 0 &&
                    chartView.mostViewPages && (
                      <LineChart responseData={responseData} />
                    )}
                </Card.Body>
              </Card>
            </Col>
          )}
          {chartView.barChart && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100">
                {responseData && responseData.length > 0 && (
                  <BarChart
                    responseData={usersResponseData}
                    maxUniqueUsers={userCount}
                  />
                )}
              </Card>
            </Col>
          )}

          {chartView.usersByCity && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Users by City</h4>
                </Card.Header>
                <LocationCard usersByLocation={usersByLocation.city} />
              </Card>
            </Col>
          )}

          {chartView.mostViewPages && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <MostViewPages
                title="Most View Pages"
                pageData={pageViews.pageData}
              />
            </Col>
          )}

          {chartView.trafficChart && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">User Type Traffic</h4>
                </Card.Header>
                <Card.Body className="p-1 d-flex justify-content-center align-items-center">
                  <DonutChart
                    series={[
                      userType.newVisitor.data[0],
                      userType.returningVisitor.data[0],
                    ]}
                    options={{
                      labels: [
                        userType.newVisitor.label,
                        userType.returningVisitor.label,
                      ],
                    }}
                    type="donut"
                    height={300}
                    width={390}
                  />
                </Card.Body>
              </Card>
            </Col>
          )}

          {chartView.usersByCountry && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Users by Country</h4>
                </Card.Header>
                <LocationCard usersByLocation={usersByLocation.country} />
              </Card>
            </Col>
          )}
          {chartView.browsers && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100 ">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Browsers</h4>
                </Card.Header>
                <Browsers data={browsersStatistics.browsers} />
              </Card>
            </Col>
          )}
          {chartView.devices && (
            <Col xl={4} lg={12} md={12} className="mb-4">
              <Card className="h-100 ">
                <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Devices</h4>
                </Card.Header>
                <Browsers data={browsersStatistics.devices} />
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </Fragment>
  );
};

export default Analytics;
