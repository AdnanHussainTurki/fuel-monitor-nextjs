import { SessionProvider } from 'next-auth/react';
import getBrands from '../src/fetchs/getBrands';
import BrandsStore from '../src/stores/BrandsStore';
import WalletSelectModal from '../src/components/Layout/WalletSelectModal/WalletSelectModal';
import withWeb3Provider from '../src/hoc/withWeb3Provider'
import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import AccountListener from '../src/components/Account/AccountListener';
import { ToastContainer } from 'react-toastify';

function App({ Component, pageProps, err }) {
    
     return (
        <SessionProvider session={pageProps.session}>
            <ToastContainer/>
            <AccountListener />
            <WalletSelectModal />
            <Component {...pageProps} err={err} />
            
        </SessionProvider>)
}
export default withWeb3Provider(App)