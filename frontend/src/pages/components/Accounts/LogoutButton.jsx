import { useLogoutUser } from "@/auth/api";
export const LogoutButton = () => {
    const logoutUser = useLogoutUser();
  
    const handleLogout = async () => {
      try {
        const message = await logoutUser();
        console.log(message); // "Logout successful."
        // You can add any additional logout logic here, like updating the UI
      } catch (error) {
        console.error("Logout failed:", error.message);
        // Handle the error, maybe show a notification to the user
      }
    };
  
    return <button onClick={handleLogout}>Logout</button>;
  };