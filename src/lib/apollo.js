import { ApolloClient, InMemoryCache, createHttpLink, split, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { nhost } from './nhost';

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: nhost.graphql.getUrl(),
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            console.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
            );

            // If it's an auth error, sign out
            if (extensions?.code === 'invalid-jwt' || extensions?.code === 'unauthenticated') {
                console.log('Auth error detected, signing out...');
                nhost.auth.signOut();
            }
        });
    }

    if (networkError) {
        console.error(`Network error: ${networkError}`);
    }
});

// Authentication middleware
const authLink = setContext((_, { headers }) => {
    const accessToken = nhost.auth.getAccessToken();
    const authHeaders = accessToken ? { authorization: `Bearer ${accessToken}` } : {};
    console.log('Auth headers being sent:', authHeaders);

    return {
        headers: {
            ...headers,
            ...authHeaders
        },
    };
});

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: nhost.graphql.getUrl().replace('https', 'wss'),
        connectionParams: () => {
            const accessToken = nhost.auth.getAccessToken();
            return accessToken ? {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            } : {};
        },
        on: {
            connected: () => console.log('WebSocket connected'),
            error: (error) => console.error('WebSocket error:', error),
            closed: () => console.log('WebSocket connection closed'),
        },
        shouldRetry: () => true,
        retryAttempts: 5,
        connectionAckWaitTimeout: 10000,
    })
);

// Split link - use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    ApolloLink.from([errorLink, authLink, httpLink])
);

// Create Apollo Client
export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    },
});
