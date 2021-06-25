import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { useMemo } from "react";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({ uri: "/api/graphql", credentials: "same-origin" }), //same-origin...will pass on the cookies and the headers from BE
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
};

/**
 * Hook that gets an instance of the Apollo Client
 */

export function useApollo() {
  const client = useMemo(() => createApolloClient(), []);
  return client;
}
