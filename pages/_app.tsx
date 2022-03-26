import '../styles/globals.css'
import Head from 'next/head';
import type {AppProps} from 'next/app'

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"/>
                <title>Unsplash Client - Unofficial</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp
