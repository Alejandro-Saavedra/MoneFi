import React, { Fragment } from "react";
import { Card, Form, Row, Col, Button, Image } from "react-bootstrap";
import { Formik, Field } from "formik";
import PropTypes from "prop-types";
import UploadFile from "components/files/UploadFile";
import debug from "sabio-debug";
import { useState } from "react";

const _logger = debug.extend("UserSettings");

const EditProfile = ({ userInfo }) => {
  const [uploadedUrl, setUploadUrl] = useState("");
  const [profileImg, setProfileImg] = useState({
    Image: userInfo.avatarUrl,
  });
  _logger("edit profile", userInfo);
  const gettingFile = (arr) => {
    let fileUrl = arr[0].url;
    _logger("fileUrl", fileUrl);
    setUploadUrl(fileUrl);
    setProfileImg((prevState) => {
      const newUserInfo = { ...prevState };
      newUserInfo.Image = uploadedUrl;
      return newUserInfo;
    });
  };

  return (
    <Fragment>
      <Col>
        <Card className="border-0">
          <Card.Header>
            <div className="mb-2 mb-lg-0">
              <h3 className="mb-0">Profile Details</h3>
              <p className="mb-0">
                Edit your account settings and change your password here.
              </p>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="d-lg-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center mb-4 mb-lg-0">
                <Image
                  // src={userInfo.avatarUrl}
                  src={profileImg.Image}
                  id="img-uploaded"
                  className="avatar-xl rounded-circle"
                  alt=""
                />
                <div className="ms-2">
                  <h4 className="mb-0">Your avatar</h4>
                  <p className="mb-0">
                    PNG or JPG no bigger than 800px wide and tall.
                  </p>
                </div>
              </div>
              <div>
                <UploadFile getResponseFile={gettingFile} />
              </div>
            </div>
            <hr className="my-2" />
            <div>
              <h4 className="mb-0">Personal Details</h4>
              <p className="mb-3">
                Edit your personal information and address.
              </p>
              {/* Form */}
              <Formik
                initialValues={{
                  firstName: `${userInfo.firstName}`,
                  lastName: `${userInfo.lastName}`,
                  mi: `${userInfo.mi}`,
                }}
                onSubmit={(values) => {
                  // Handle form submission
                  _logger(values);
                }}
              >
                <Form>
                  <Row>
                    {/* First name */}
                    <Col md={6} sm={12} className="mb-3">
                      <label htmlFor="firstName">First Name</label>
                      <Field
                        name="firstName"
                        type="text"
                        className="form-control"
                        required
                      />
                    </Col>

                    {/* Last name */}
                    <Col md={6} sm={12} className="mb-3">
                      <label htmlFor="lastName">Last Name</label>
                      <Field
                        name="lastName"
                        type="text"
                        className="form-control"
                        required
                      />
                    </Col>

                    {/* mi */}
                    <Col md={6} sm={12} className="mb-3">
                      <label htmlFor="mi">Middle Initial</label>
                      <Field
                        name="mi"
                        type="text"
                        className="form-control"
                        required
                      />
                    </Col>

                    {/* Button */}
                    <Col sm={12} md={12}>
                      <Button variant="primary" type="submit">
                        Update Profile
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Formik>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  );
};

EditProfile.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.number,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    mi: PropTypes.string,
  }),
};

export default EditProfile;
