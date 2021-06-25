import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo";
import { AuthProvider } from "src/auth/useAuth";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(); //Get instance of the Apollo created with the hook

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Head>
          <title> House Listings | By Jeff</title>
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          {/*/favicon.ico  will work since it is on the public folder as our baseurl is . on the settings */}
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
}
