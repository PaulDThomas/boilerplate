import { Button, Input, Label, makeStyles, shorthands } from "@fluentui/react-components";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";

const useStyles = makeStyles({
  container: {
    paddingTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
    maxWidth: "400px",
    minWidth: "300px",

    "> div": {
      display: "flex",
      flexDirection: "column",
      ...shorthands.gap("2px"),
    },
  },
  formInvalid: {
    color: "red",
    fontSize: "12px",
  },
  btn: {
    width: "120px",
    alignSelf: "flex-end",
  },
});

export const Login = (): JSX.Element => {
  const styles = useStyles();

  // Get current authContext
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

  // Print log in page
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div>
          <Label
            htmlFor="user-email"
            required
          >
            Email
          </Label>
          <Input
            id="user-email"
            type="email"
            autoComplete="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <div className={styles.formInvalid}>{emailWarn}</div>
        </div>

        <div>
          <Label
            htmlFor="user-password"
            required
          >
            Password
          </Label>
          <Input
            id="user-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <div className={styles.formInvalid}>{pwdWarn}</div>
        </div>
        <div>
          <Button
            className={styles.btn}
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              submitForm();
            }}
          >
            Submit
          </Button>
        </div>
        <div>{feedback}</div>
      </form>
    </div>
  );
};
