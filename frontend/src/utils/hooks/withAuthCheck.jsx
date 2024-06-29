import { useEffect, useState } from "react";
import axios from "axios";

const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          await fetchUserProfile(token);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Authentication error:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []); // Runs only once on mount

  const fetchUserProfile = async (token) => {
    const api = axios.create({
      baseURL: "http://127.0.0.1:8000/api/",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    try {
      const userResponse = await api.get("auth/me/");
      const userData = userResponse.data;
      const username = userData.username;

      const profileResponse = await api.get(`auth/profile/${username}/`);
      const profileData = profileResponse.data;

      setUserProfile(profileData);
    } catch (error) {
      console.error("Fetch user profile error:", error);
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 401
    ) {
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  return { isAuthenticated, userProfile, isLoading };
};

export default useAuthCheck;
