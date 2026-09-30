import React from "react";
import ReactDOM from "react-dom/client";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

import { ApolloProvider } from "@apollo/client/react";

import { setContext } from "@apollo/client/link/context";

import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL
});

const authLink = setContext((_, { headers }) => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token
        ? `Bearer ${token}`
        : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);