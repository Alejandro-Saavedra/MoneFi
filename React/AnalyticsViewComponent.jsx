import React from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";

const AnalyticsView = ({ chartView, onChartViewChange }) => {
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedChartView = { ...chartView, [name]: checked };
    onChartViewChange(updatedChartView);
  };

  return (
    <div>
      <h3>Select your views</h3>
      <Table className="form-check">
        <tbody>
          <tr>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="lineChart"
                  checked={chartView.lineChart}
                  onChange={handleCheckboxChange}
                />
                Line Chart
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="barChart"
                  checked={chartView.barChart}
                  onChange={handleCheckboxChange}
                />
                Bar Chart
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="usersByCity"
                  checked={chartView.usersByCity}
                  onChange={handleCheckboxChange}
                />
                Users by City
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="mostViewPages"
                  checked={chartView.mostViewPages}
                  onChange={handleCheckboxChange}
                />
                Most Viewed Pages
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="trafficChart"
                  checked={chartView.trafficChart}
                  onChange={handleCheckboxChange}
                />
                Traffic Chart
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="usersByCountry"
                  checked={chartView.usersByCountry}
                  onChange={handleCheckboxChange}
                />
                Users by Country
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="browsers"
                  checked={chartView.browsers}
                  onChange={handleCheckboxChange}
                />
                Browsers
              </label>
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  checked={chartView.devices}
                  onChange={handleCheckboxChange}
                />
                Devices
              </label>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

AnalyticsView.propTypes = {
  chartView: PropTypes.shape({
    lineChart: PropTypes.bool.isRequired,
    barChart: PropTypes.bool.isRequired,
    usersByCity: PropTypes.bool.isRequired,
    usersByCountry: PropTypes.bool.isRequired,
    browsers: PropTypes.bool.isRequired,
    mostViewPages: PropTypes.bool.isRequired,
    trafficChart: PropTypes.bool.isRequired,
    devices: PropTypes.bool.isRequired,
  }).isRequired,
  onChartViewChange: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
};

export default AnalyticsView;
