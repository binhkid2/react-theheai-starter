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
  const showToast = (input:string) => toast.error(input, {
    position: "bottom-center"
  })
  interface JwtPayloadWithUserId extends jwt.JwtPayload {
    userId: string;
  }
  const location = useLocation() 
  async function getUserInfo(token:string){
    //get_jwt_key 
    const url_get_jwt_key = import.meta.env.VITE_THEHEAI_SANDBOX_GET_JWT_KEY;
    const getSecretkey = await axios.get(url_get_jwt_key);
    const secretKey = getSecretkey.data.jwtSecretKey;
    const userIdToken = jwt.verify(token, secretKey) as JwtPayloadWithUserId;
    const userId = userIdToken.userId;
//get userInfo
const getUserInfoUrl = import.meta.env.VITE_THEHEAI_SANDBOX_CHECKUSER;
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
       showToast('Failed to get user information') //toast error
    });
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      console.log('Token:', token);
      getUserInfo(token)
    }else{ 
      showToast('No token provided! ❌❌❌')
    }
  }, [location.search]);
  return (
    <> 
    <Toaster/>
    {isAuthenticated && !isLoading && <HomeContent />}
      {isLoading && <LoadingOverlay />}
      {!isAuthenticated && !isLoading && <Page404 />}
    </>
  );
}
