import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLogout = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Använd UserContext's logout funktion
      if (userContext) {
        await userContext.logout(); // Använd den existerande logout logiken från kontexten

        // Navigera till login-sidan
        navigate("/");
        toast.success("Logged out successfully.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error occurred during logout.");
    }
  };

  return { logout };
};
