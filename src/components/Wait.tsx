import { useCallback, useEffect, useState } from "react";
import { iSuspensified, suspensify } from "../functions/suspensify";

interface WaitProps {
  seconds: number;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const Wait = ({ seconds }: WaitProps): JSX.Element => {
  const [receivedText, setReceivedText] = useState<string>("nothing yet");
  const [promiseHolder, setPromiseHolder] = useState<iSuspensified>();

  const getText = async (ms: number) => {
    try {
      // const ret = await axios.get(`${process.env.REACT_APP_API_URL}/waiter.php?seconds=${seconds}`);
      setReceivedText("Starting");
      await delay(ms);
      // setLoading(false);
      setReceivedText("Finished");
    } catch (error: unknown) {
      console.warn("Something went wrong");
      console.warn(error);
    }
  };

  const loading = promiseHolder ? promiseHolder.read() : null;
  const callSuspender = useCallback((ms: number) => {
    setPromiseHolder(suspensify(getText(ms)));
  }, []);

  useEffect(() => {
    callSuspender(seconds * 1000);
  }, [callSuspender, seconds]);

  return (
    <div
      style={{
        height: "100px",
        width: "400px",
        padding: "1rem",
        backgroundColor: "red",
        borderRadius: "1rem",
      }}
    >
      {loading ? "Loading" : receivedText}
      <br />
      <button onClick={() => callSuspender(500)}>Reload</button>
    </div>
  );
};
