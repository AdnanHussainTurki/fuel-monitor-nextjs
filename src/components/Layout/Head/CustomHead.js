import Head from 'next/head' 
import {app} from '../../../config/app'
export default function CustomHead() {    
    return (
        <Head>
            <title>{app.name}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}