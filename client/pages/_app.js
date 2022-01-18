import { useState, createContext, useEffect } from "react";
import RedAlert from "../components/Alert";
import "../styles/globals.css";

export const AlertContext = createContext({
  isAlertActive: false,
  setActiveAlert: () => {},
});

// export const socket = io.connect("http://52.64.24.209/api");
// export const SocketContext = createContext();

function MyApp({ Component, pageProps }) {
  const [isAlertActive, setActiveAlert] = useState(false);
  const value = { isAlertActive, setActiveAlert };
  
  // useEffect(() => {
  //   socket.on("alarm", (isAlarmOn) => {
  //     console.log("client alarm triggered", socket.id, isAlarmOn);

  //     setActiveAlert(isAlarmOn);
  //   });

  //   return () => socket.disconnect();
  // }, []);

  return (
    // <SocketContext.Provider value={socket}>
      <AlertContext.Provider value={value}>
        {isAlertActive ? <RedAlert /> : null}
        <Component {...pageProps} />
      </AlertContext.Provider>
    // </SocketContext.Provider>
  );
}

export default MyApp;
