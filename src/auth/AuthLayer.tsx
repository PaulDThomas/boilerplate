import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthLayer = ({
  children,
}: {
  children: null | JSX.Element | JSX.Element[];
}): JSX.Element => {
  // Use context, set variables
  const authContext = useContext(AuthContext);
  const [userPK, setUserPK] = useState<number | null>();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const userDisplayName = useMemo<string>(
    () => `${userFirstName} ${userLastName}`,
    [userFirstName, userLastName],
  );

  // Add request interceptor
  axios.interceptors.request.use((config) => {
    const token = authContext.getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  });

  // Response interceptor
  axios.interceptors.response.use((response) => {
    if (
      response.config.url?.endsWith("/login.php") &&
      response.data.success &&
      response.data.token
    ) {
      authContext.saveToken(response.data.token);
      axios.get(process.env.REACT_APP_API_URL + "/getUser.php").then(
        (response: AxiosResponse) => {
          setUserPK(response.data.user.userPK);
          setUserEmail(response.data.user.userEmail);
          setUserFirstName(response.data.user.userFirstName);
          setUserLastName(response.data.user.userLastName);
        },
        (error: AxiosError) => {
          console.warn(error);
        },
      );
    }
    if (response.config.url?.endsWith("/getUser.php") === true && response.data.user.userPK) {
      setUserPK(response.data.user.userPK);
      setUserEmail(response.data.user.userEmail);
      setUserFirstName(response.data.user.userFirstName);
      setUserLastName(response.data.user.userLastName);
    }
    return response;
  });

  return (
    <AuthContext.Provider
      value={{
        ...authContext,
        userPK,
        userEmail,
        userFirstName,
        userLastName,
        userDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
