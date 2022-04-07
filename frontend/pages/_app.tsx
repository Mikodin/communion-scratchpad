import Head from "next/head";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>Communion</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default MyApp;
