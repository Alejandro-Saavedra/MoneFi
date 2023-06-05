import React from "react";
import { Card, Table, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { Fragment } from "react";

const Browsers = ({ data }) => {
  return (
    <Fragment>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table className="mb-0 text-nowrap">
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="border-top-0 ">
                      <Image src={item.logo} alt="" className="me-2" />{" "}
                      <span className="align-middle ">
                        {item.browser ? item.browser : item.device}
                      </span>
                    </td>
                    <td className="text-end border-top-0  ">{item.percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Fragment>
  );
};

Browsers.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      browser: PropTypes.string,
      percent: PropTypes.number,
    })
  ),
}.isRequired;

export default Browsers;
