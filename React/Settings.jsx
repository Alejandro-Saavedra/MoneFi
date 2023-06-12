import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { Col, Row, Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { updateEmail, updatePassword } from "services/userService";
import debug from "debug";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { getCurrent } from "services/userService";
import { Fragment } from "react";
import "./users.css";
import {
  settingsEmailSchema,
  settingsPasswordSchema,
} from "../../schemas/userSettingsSchema";
import Swal from "sweetalert2";

const _logger = debug.extend("UserSettings");

const Settings = (props) => {
  _logger("props", props.logout);
  const [formData, setFormData] = useState({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
  });

  const PasswordMeter = () => {
    const { values } = useFormikContext();
    return <PasswordStrengthMeter password={values.newPassword} />;
  };

  const onGetCurrentSuccess = (response) => {
    const userInfo = response.item;
    _logger("current user success", userInfo);
    setFormData((prevState) => {
      const newUserInfo = { ...prevState };
      newUserInfo.id = userInfo.id;
      newUserInfo.email = userInfo.email;
      newUserInfo.firstName = userInfo.firstName;
      newUserInfo.lastName = userInfo.lastName;
      return newUserInfo;
    });
  };

  const onGetCurrentError = (response) => {
    _logger("currentuser error", response);
  };

  useEffect(() => {
    getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentError);
  }, []);
  _logger("formData", formData.email);

  const handlePasswordSubmit = (values, { setSubmitting }) => {
    _logger("passwordForm values:", values);
    const payload = { ...values, id: formData.id };
    updatePassword(payload)
      .then(onPasswordUpdateSuccess)
      .catch(onPasswordUpdateError);

    setSubmitting(false);
  };

  const onPasswordUpdateSuccess = (response) => {
    _logger("password update success", response);
    Swal.fire({
      closeOnCancel: true,
      heightAuto: false,
      title: "Your Password has been updated! Please Log back in!",
      icon: "info",
    }).then(function () {
      props.logout();
    });
  };

  const onPasswordUpdateError = (response) => {
    _logger("password update error", response);
    let errMessage = "<p>Make sure your current password is correct</p>";
    Swal.fire({
      closeOnCancel: true,
      heightAuto: false,
      title: "Password update failed",
      html: errMessage,
      icon: "error",
    });
  };

  const handleEmailSubmit = (values, { setSubmitting }) => {
    _logger("emailForm values:", values);
    const payload = { ...values, id: formData.id };
    if (values.email !== formData.email) {
      updateEmail(payload).then(onEmailUpdateSuccess).catch(onEmailUpdateError);
    } else {
      let errMessage =
        "<p>Make sure your email address is a different one.</p>";
      Swal.fire({
        closeOnCancel: true,
        heightAuto: false,
        title: "Email update failed",
        html: errMessage,
        icon: "error",
      });
    }
    setSubmitting(false);
  };

  const onEmailUpdateSuccess = (response) => {
    _logger("onEmail Success", response);
    Swal.fire({
      closeOnCancel: true,
      heightAuto: false,
      title: "Your Email has been updated, please log back in.",
      icon: "info",
    }).then(function () {
      props.logout();
    });
  };
  const onEmailUpdateError = (response) => {
    _logger("onEmail Error", response);
    let errMessage =
      "<p>That email already exists or your current password is incorrect</p>";
    Swal.fire({
      closeOnCancel: true,
      heightAuto: false,
      title: "Email update failed",
      html: errMessage,
      icon: "error",
    });
  };

  return (
    <Fragment>
      <Col xl={{ offset: 3, span: 6 }} md={12} xs={12}>
        <Card className="border-0">
          <Card.Header>
            <div className="mb-3 mb-lg-0">
              <h3 className="mb-0">Security</h3>
              <p className="mb-0">
                Edit your account settings and change your password here.
              </p>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={6} md={12} sm={12} className="mb-3">
                <h4 className="mb-0">Email Address</h4>
                <p>
                  Your current email address is{" "}
                  <span className="text-success">{formData.email}</span>
                </p>
                <Formik
                  initialValues={{ email: "", currentPassword: "" }}
                  validationSchema={settingsEmailSchema}
                  onSubmit={handleEmailSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group mb-4">
                        <label htmlFor="email">New email address</label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          id="email"
                          required
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger position-absolute"
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <Field
                          type="password"
                          name="currentPassword"
                          className="form-control"
                          id="currentPassword"
                          required
                        />
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="text-danger position-absolute"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="btn btn-primary mt-2"
                        disabled={isSubmitting}
                      >
                        Update Email
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>

              <Col
                lg={6}
                md={12}
                sm={12}
                className="mb-3 d-flex align-self-start"
              >
                <Formik
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={settingsPasswordSchema}
                  onSubmit={handlePasswordSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div>
                        <h4 className="mb-0">Change Password</h4>
                        <p>
                          We will email you a confirmation when changing your
                          password.
                        </p>

                        <div className="form-group mb-4">
                          <label htmlFor="currentPassword">
                            Current Password
                          </label>
                          <Field
                            type="password"
                            name="currentPassword"
                            className="form-control"
                            id="currentPassword"
                            required
                          />
                          <ErrorMessage
                            name="currentPassword"
                            component="div"
                            className="text-danger position-absolute"
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label htmlFor="newPassword">New Password</label>
                          <Field
                            type="password"
                            name="newPassword"
                            className="form-control"
                            id="newPassword"
                            required
                          />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <PasswordMeter />

                        <div className="form-group mb-5">
                          <label htmlFor="confirmPassword">
                            Confirm New Password
                          </label>
                          <Field
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            id="confirmPassword"
                            required
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-danger position-absolute"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          Change Password
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  );
};

Settings.propTypes = {
  logout: PropTypes.func,
};

export default Settings;
