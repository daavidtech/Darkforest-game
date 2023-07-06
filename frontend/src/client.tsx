
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";




const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? token : null;
};
const authLink = setContext((_, { headers }) => {
  const token = getToken()

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // ...muut asetukset
});