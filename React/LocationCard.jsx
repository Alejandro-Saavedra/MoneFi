import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Card, Table } from "react-bootstrap";
import PropTypes from "prop-types";

const LocationCard = ({ usersByLocation }) => {
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    let totalSessions = 0;
    Object.values(usersByLocation).forEach((locationData) => {
      totalSessions += locationData.sessions;
    });

    setTotalSessions(totalSessions);
  }, [usersByLocation]);

  const renderLocationRows = () => {
    return Object.entries(usersByLocation)
      .sort((a, b) => b[1].sessions - a[1].sessions)
      .slice(0, 8)
      .map(([location, locationData]) => {
        const sessions = locationData.sessions;
        const percentage = ((sessions / totalSessions) * 100).toFixed(2);
        return (
          <tr key={location}>
            <td>{location}</td>
            <td className="text-end">{sessions.toLocaleString()}</td>
            <td className="text-end">{percentage}%</td>
          </tr>
        );
      });
  };

  return (
    <Fragment>
      <Card.Body className="py-0">
        <Table borderless size="sm">
          <tbody>{renderLocationRows()}</tbody>
        </Table>
      </Card.Body>
    </Fragment>
  );
};

LocationCard.propTypes = {
  usersByLocation: PropTypes.objectOf(
    PropTypes.shape({
      sessions: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(LocationCard);
