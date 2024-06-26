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
  const [isAuthenticated,setIsAuthenticated ] = useAtom(isAuthenticatedStore);
  const [, setUserInfo] = useAtom(userInfoStore);
  const [isLoading,setIsLoading]=useState(false)
 
  interface JwtPayloadWithUserId extends jwt.JwtPayload {
    userId: string;
  }
  const location = useLocation() 
  async function getUserInfo(token:string){
    //get_jwt_key  
    const url_get_jwt_key = "https://sandbox.theheai.xyz/theheai-sandbox/get-jwt-key"
    const getSecretkey = await axios.get(url_get_jwt_key);
    const secretKey = getSecretkey.data.jwtSecretKey;
    const userIdToken = jwt.verify(token, secretKey) as JwtPayloadWithUserId;
    const userId = userIdToken.userId;
//get userInfo
const getUserInfoUrl = "https://sandbox.theheai.xyz/theheai-sandbox/check-userinfo"
axios.post(getUserInfoUrl, { id: userId })
    .then((getUserResponse) => {
        const userResponse = getUserResponse.data.userInfo;
        console.log('userResponse:', userResponse);
      setUserInfo(userResponse)//use your State Management Librarie  you choose to remember userInfo.DONT USE LOCALSTORAGE,it not sercure
       setIsAuthenticated(true);//use your State Management Librarie  you choose to set user is signed In
        setIsLoading(false)
    })
    .catch((error) => {
      setIsLoading(false)
        console.error('Failed to get user information', error);
        toast.error('Failed to get user information') //toast error
    });
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      console.log('Token:', token);
      getUserInfo(token)
    }else{ 
      toast.error('No token provided! ❌❌❌')
    }
  }, [location.search]);
  return (
    <> 
   <Toaster
  position="bottom-center"
  reverseOrder={false}
/>
    {isAuthenticated && !isLoading && <HomeContent />}
      {isLoading && <LoadingOverlay />}
      {!isAuthenticated && !isLoading && <Page404 />}
    </>
  );
}
