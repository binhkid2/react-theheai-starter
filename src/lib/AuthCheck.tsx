 
import { encryptStorage } from "./encrypt-storage";
import './AuthCheck.scss'
import ButtonLogin from "./ButtonLogin";
import { initUser } from "./store";

 
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function AuthCheckContent({ children }: DashboardLayoutProps) { 
  const user  =  encryptStorage.getItem('theheai-userInfo')  || initUser
  
   
  return (
    <>
     {user.zaloId !== "" ? (
    <>{children}</>
  ) : (
    <div className="container-scss">
      <div className="top-scss"></div>
      <div className="bottom-scss"></div>
      <div className="center-scss">
     <ButtonLogin/>
      </div>
    </div>
  )}
    </>
  );
}

