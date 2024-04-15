import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "./auth/AuthContext";
import { Login } from "./pages/Login";
import { Welcome } from "./pages/Welcome";

// Main application
const App = (): JSX.Element => {
  // Get auth context
  const authContext = useContext(AuthContext);

  // Check for existing token
  useEffect(() => {
    if (authContext.userno === undefined) {
      axios.get(process.env.REACT_APP_API_URL + "/getUser.php");
    }
  }, [authContext]);

  // Should be querying for user PK
  if (authContext.userno === undefined) {
    return <div>Loading...</div>;
  }
  // Display log in page
  else if (authContext.userno === null) {
    return <Login />;
  }
  // or display the rest of the app
  else {
    return <Welcome />;
  }
};

export default App;
