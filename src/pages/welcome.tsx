import { Suspense, useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import { Loading } from "../components/Loading";
import { Wait } from "../components/Wait";

export const Welcome = (): JSX.Element => {
  // Get authentication context
  const authContext = useContext(AuthContext);

  return (
    <div style={{ position: "relative" }}>
      <Button
        style={{ position: "absolute", top: "2px", right: "2px" }}
        variant="primary"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          authContext.logout();
          window.location.reload();
        }}
      >
        Log out
      </Button>
      <Container>
        <Row>
          <Col>
            <h4 className="mt-4">Welcome {authContext.userDisplayName}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Suspense fallback={<Loading />}>
              <Wait seconds={3} />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
