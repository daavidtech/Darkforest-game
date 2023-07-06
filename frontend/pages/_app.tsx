
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import {Layout} from "./layout"
import {client} from "../src/client"





export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </ApolloProvider>
  )
}