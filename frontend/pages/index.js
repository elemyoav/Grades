import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
require("dotenv").config();

export default function App(){
  const router = useRouter();

  return (
      <GoogleLogin
        onSuccess={credentialResponse => {
          const token = credentialResponse.credential;
          localStorage.setItem('token', token);
          const decodedCreds = jwtDecode(credentialResponse.credential);
          const username = decodedCreds.email.split('@')[0]
          router.push(username)
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
  )
}
