 

 
 
export default function ButtonLogin() {  
  function handleLogin(){
    window.location.href = 'https://dashboard.theheai.xyz/profile';
 }
  return (
    <>
      <button   onClick={()=>{handleLogin()}}  className="flex items-center btn   border rounded-lg shadow-md px-6 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2  ">

            <span>Đăng nhập  </span>
        </button>
    </>
  );
}