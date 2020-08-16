import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const querySelector = document && document.querySelector('meta[name=csrf-token]');
const csrfToken = querySelector && querySelector.getAttribute('content');

const cache = new InMemoryCache();
const link = new HttpLink({
	uri: "/graphql",
    credentials: "same-origin",
    headers: {
        "X-CSRF-Token": csrfToken,
    }
});

export const client = (): ApolloClient<any> => {
    return new ApolloClient({
        link,
        cache,
	});
};
