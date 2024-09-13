import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    const response = await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      // Rensa användardata från UserContext
      userContext?.setUser(null);
      // Omdirigera användaren till login-sidan
      navigate("/");
    }
  };

  return { logout };
};
