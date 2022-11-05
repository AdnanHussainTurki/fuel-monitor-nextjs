import { SessionProvider } from 'next-auth/react';
import getBrands from '../src/fetchs/getBrands';
import BrandsStore from '../src/stores/BrandsStore';
import '../styles/global.css';

function App({ Component, pageProps, err }) {
    
     return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} err={err} />
        </SessionProvider>)
}
export default App