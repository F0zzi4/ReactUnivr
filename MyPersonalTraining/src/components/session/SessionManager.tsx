import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const userData = sessionStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (user === null) {
        navigate("/", { replace: true });
      }

      const currentTime = Date.now();

      // Verify if the session is expired
      if (currentTime - user.timestamp > SESSION_TIMEOUT) {
        sessionStorage.removeItem("user");
        navigate("/", { replace: true });
        return;
      }

      // Update the timestamp with the current one
      user.lastActive = currentTime;
      sessionStorage.setItem("user", JSON.stringify(user));
    };

    // Does the check just on startup
    checkSession();

    // Check the session every 15 seconds
    const intervalId = setInterval(checkSession, 15000);

    // Clear the interval
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, location.pathname]);

  return null; // this component does not have to render anything
};

export default SessionManager;
