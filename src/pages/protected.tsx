import AuthCheckContent from "../lib/AuthCheck"
import { encryptStorage } from "../lib/encrypt-storage";
import { initUser } from "../lib/store";

export default function ProtectedPage() {
    const user  =  encryptStorage.getItem('theheai-userInfo')  || initUser  //Demo dont use like this.Use state management instead
    console.log(user)
  return (
    <>
    <AuthCheckContent>
   <h1>Protected Router</h1>

Hello {user.name || ''}
<img src={user.avatar || ''} alt="user avatar" className="w-20 h-20 object-cover"/>


   </AuthCheckContent>
    </>
  );
}