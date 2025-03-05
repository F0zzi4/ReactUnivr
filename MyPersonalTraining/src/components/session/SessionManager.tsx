import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 ora in millisecondi

const SessionManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // Se non ci sono dati dell'utente o i campi non sono validi, esci
      if (user === null) {
        navigate("/", { replace: true });
      }

      const currentTime = Date.now();
      console.log("⏲️ Checking session - ", currentTime - user.timestamp);
      // Verifica se la sessione è scaduta (1 ora)
      if (currentTime - user.timestamp > SESSION_TIMEOUT) {
        console.log("⏳ Session expired. Logging out automatically.");
        sessionStorage.removeItem("user");
        navigate("/", { replace: true });
        return;
      }

      // Aggiorna il timestamp di ultima attività
      user.lastActive = currentTime;
      sessionStorage.setItem("user", JSON.stringify(user));
    };

    // Esegui il controllo della sessione subito al montaggio
    checkSession();

    // Imposta un intervallo per controllare la sessione ogni 15 secondi
    const intervalId = setInterval(checkSession, 15000);

    // Pulizia dell'intervallo quando il componente viene smontato
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  return null; // Questo componente non deve renderizzare nulla
};

export default SessionManager;
