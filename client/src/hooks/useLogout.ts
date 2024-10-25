import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogout = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Rensa användardata från UserContext
        userContext?.setUser(null);
        // Omdirigera användaren till login-sidan
        navigate("/");
        toast.success("Logged out successfully.");
      } else {
        console.error("Logout failed with status:", response.status);
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error occurred during logout.");
    }
  };

  return { logout };
};
