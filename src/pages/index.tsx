import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import jwt from 'jsonwebtoken'; 
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
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function getUserInfo(token:any) {
      try {
        // Fetch secret key from your API
        const getSecretKeyResponse = await axios.get("https://sandbox.theheai.xyz/theheai-sandbox/get-jwt-key");
        const secretKey = getSecretKeyResponse.data.jwtSecretKey;

        // Decode JWT and extract userId
        const userIdToken = jwt.verify(token, secretKey);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
        const userId = userIdToken.userId;

        // Fetch user info using userId
        const getUserInfoUrl = "https://sandbox.theheai.xyz/theheai-sandbox/check-userinfo";
        const getUserInfoResponse = await axios.post(getUserInfoUrl, { id: userId });
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
    }

    if (token) {
      console.log('Token:', token);
      setIsLoading(true);
      getUserInfo(token);
    } else {
      setIsLoading(false);
      toast.error('No token provided! ❌❌❌');
    }
  }, [location.search]);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {isAuthenticated && !isLoading && <HomeContent />}
      {isLoading && <LoadingOverlay />}
      {!isAuthenticated && !isLoading && <Page404 />}
    </>
  );
}
