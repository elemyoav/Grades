import "@/styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
require("dotenv").config();

export default function App({ Component, pageProps }) {
  return (
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <Component {...pageProps} />
          </GoogleOAuthProvider>
        );
}
