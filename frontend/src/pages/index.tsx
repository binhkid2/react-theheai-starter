import  { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useAtom } from "jotai";
import { isAuthenticatedStore, userInfoStore } from "../lib/store";
import LoadingOverlay from "../lib/LoadingOverlay";
import HomeContent from "../lib/components/Home/Content";
import Page404 from "../lib/Page404";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedStore);
  const [, setUserInfo] = useAtom(userInfoStore);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        toast.error('No token provided! ❌❌❌');
        return;
      }

      try {
        setIsLoading(true);
        // Fetch user info using token
        const getUserInfoUrl = "http://localhost:8080/api/verify-token";
        const getUserInfoResponse = await axios.post(getUserInfoUrl, { token: token });
        const userResponse = getUserInfoResponse.data.userInfo;
        // Update global state
        setUserInfo(userResponse);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Failed to get user information', error);
        toast.error('Failed to get user information');
      }
    };

    fetchData();
  }, [location.search, setIsAuthenticated, setUserInfo]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {isAuthenticated && !isLoading && <HomeContent />}
      {isLoading && <LoadingOverlay />}
      {!isAuthenticated && !isLoading && <Page404 />}
    </>
  );
}
