import axios, { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useContext, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';

export const Login = (): JSX.Element => {
  // Get current authContext
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailWarn, setEmailWarn] = useState<string | null>(null);
  const [pwdWarn, setPwdWarn] = useState<string | null>(null);

  // Send information to login
  const submitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // Check data
      let newPwdWarn = null;
      let newEmailWarn = null;
      if ((password?.length ?? 0) < 8) {
        newPwdWarn = 'Password must be at least 8 characters';
      }
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        newEmailWarn = 'Please enter a valid email address';
      }
      setPwdWarn(newPwdWarn);
      setEmailWarn(newEmailWarn);
      if (newPwdWarn || newEmailWarn) return;

      // Submit the data, it is handled in AuthLayer
      const url = process.env.REACT_APP_API_URL + 'login.php';
      const data = { email, password };
      axios.post(url, data).then(
        (response: AxiosResponse) => {
          // No action required, handled in AuthLayer
          console.log(response);
        },
        (error: AxiosError) => {
          console.warn(error.response);
        },
      );
    },
    [email, password],
  );

  // Show nothing if already logged in
  if (authContext.userPK) {
    return <></>;
  }

  // Print log in page
  return (
    <Container>
      <Row>
        <Col
          className='justify-content-center'
          md={{ span: 6, offset: 3 }}
        >
          <Form
            id='form-login'
            className='border border-dark rounded m-4 p-4'
            onSubmit={submitForm}
          >
            <Form.Group
              className='mb-3'
              controlId='form-login-uid'
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                isInvalid={emailWarn !== null}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <Form.Control.Feedback type='invalid'>{emailWarn}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className='mb-3'
              controlId='form-login-pwd'
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                isInvalid={pwdWarn !== null}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Form.Control.Feedback type='invalid'>{pwdWarn}</Form.Control.Feedback>
            </Form.Group>
            <Button
              className='align-self-end'
              variant='primary'
              type='submit'
              onSubmit={submitForm}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
