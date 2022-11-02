import { SessionProvider } from 'next-auth/react';
import '../styles/global.css';

function App({ Component, pageProps, err }) {
   
     return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} err={err} />
        </SessionProvider>)
}
export default App