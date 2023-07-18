
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";




const getToken = () => {
	const token = localStorage.getItem('token');
	return token ? token : null;
};
const authLink = setContext((_, { headers }) => {
	const token = getToken()
	console.log("lähetys" ,token)

	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const typePolicies = {
	Query: {
		fields: {
			viewer: {
				keyArgs: false,
				// Provide a custom cache key function for the `viewer` field
				read(_, { args, toReference }) {
					// If the viewer has an `id` field, use it as the cache key
					if (args?.id) {
						return toReference({
							__typename: 'Viewer',
							id: args.id,
						});
					}
					// Otherwise, use the default cache key behavior
					return undefined;
				},
			},
		},
	},
};

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({
		typePolicies,
	}),
	// ...muut asetukset
});