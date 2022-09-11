import { useContext } from 'react';
import { AuthContext } from './auth/AuthContext';
import { Login } from './pages/login';
import { Welcome } from './pages/welcome';

// Main application
const App = (): JSX.Element => {
  // Get auth context
  const authContext = useContext(AuthContext);

  // Display log in page
  if (!authContext.userPK) {
    return <Login />;
  }
  // or display the rest of the app
  else {
    return <Welcome />;
  }
};

export default App;
