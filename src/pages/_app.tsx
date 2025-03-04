import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import Head from "next/head";
import icon from "../../public/weather-icon2.png"
import { api } from "~/utils/api";
import { Analytics } from "@vercel/analytics/react"
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href={icon.src} />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
};

export default api.withTRPC(MyApp);
