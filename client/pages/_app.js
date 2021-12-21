import { useState, createContext } from "react";
import RedAlert from "../components/Alert";
import "../styles/globals.css";

export const AlertContext = createContext({
  isAlertActive: false,
  setActiveAlert: () => {},
});

function MyApp({ Component, pageProps }) {
  const [isAlertActive, setActiveAlert] = useState(false);
  const value = { isAlertActive, setActiveAlert };
  

  return (
    <AlertContext.Provider value={value}>
      {isAlertActive ? <RedAlert /> : null}
      <Component {...pageProps} />
    </AlertContext.Provider>
  );
}

export default MyApp;
