import axios, { AxiosError } from "axios";
import { useCallback, useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";

export const Login = (): JSX.Element => {
  // Get current authContext
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailWarn, setEmailWarn] = useState<string | null>(null);
  const [pwdWarn, setPwdWarn] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  // Send information to login
  const submitForm = useCallback(async () => {
    // Check data
    let newPwdWarn = null;
    let newEmailWarn = null;
    if ((password?.length ?? 0) < 8) {
      newPwdWarn = "Password must be at least 8 characters";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newEmailWarn = "Please enter a valid email address";
    }
    setPwdWarn(newPwdWarn);
    setEmailWarn(newEmailWarn);
    if (newPwdWarn || newEmailWarn) return;

    // Submit the data, it is handled in AuthLayer
    const url = process.env.REACT_APP_API_URL + "/login.php";
    const data = { email, password };
    try {
      await axios.post(url, data);
      // No action required, handled in AuthLayer
    } catch (error: unknown) {
      if ((error as AxiosError).code !== undefined) {
        const axErr = error as AxiosError;
        console.warn(axErr.response ?? "An error has occured");
        setFeedback(
          (axErr.response?.data as { success: boolean; message: string }).message ??
            axErr.response?.statusText ??
            "An error has occured",
        );
      } else {
        console.warn(error);
        setFeedback(typeof error === "string" ? error : "An unknown error has occured");
      }
    }
  }, [email, password]);

  // Show nothing if already logged in
  if (authContext.userPK) {
    return <></>;
  }

  // Print log in page
  return (
    <Container fluid>
      <Row>
        <Col
          className="justify-content-center"
          md={{ span: 8, offset: 2 }}
        >
          <Form
            id="form-login"
            className="border border-dark rounded m-4 p-4"
            onSubmit={submitForm}
          >
            <Form.Group
              className="mb-3"
              controlId="form-login-uid"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                isInvalid={emailWarn !== null}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <Form.Control.Feedback type="invalid">{emailWarn}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="form-login-pwd"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                isInvalid={pwdWarn !== null}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Form.Control.Feedback type="invalid">{pwdWarn}</Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md="auto">
                <Button
                  className="align-self-end"
                  variant="primary"
                  type="submit"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    submitForm();
                  }}
                >
                  Submit
                </Button>
              </Col>
              <Col>{feedback}</Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
