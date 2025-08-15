// src/lib/apollo.js
import { ApolloClient, InMemoryCache, createHttpLink, split, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { nhost } from './nhost'

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: nhost.graphql.getUrl()
})

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            console.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
            )

            // If it's an auth error, sign out
            if (extensions?.code === 'invalid-jwt' || extensions?.code === 'unauthenticated') {
                console.log('Auth error detected, signing out...')
                nhost.auth.signOut()
            }
        })
    }

    if (networkError) {
        console.error(`Network error: ${networkError}`)

        // If it's a 401, the token might be expired
        if (networkError.statusCode === 401) {
            console.log('401 error detected, attempting to refresh token...')
            // Nhost should handle token refresh automatically
            // If it fails, it will sign out the user
        }
    }
})

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: nhost.graphql.getUrl().replace('https', 'wss').replace('http', 'ws'),
        connectionParams: () => {
            const headers = nhost.auth.getAuthHeaders()
            return {
                headers
            }
        },
        on: {
            connected: () => console.log('WebSocket connected'),
            error: (error) => console.error('WebSocket error:', error),
            closed: () => console.log('WebSocket connection closed')
        },
        shouldRetry: () => true,
        retryAttempts: 5,
        connectionAckWaitTimeout: 10000
    })
)

// Authentication middleware
const authLink = setContext((_, { headers }) => {
    const authHeaders = nhost.auth.getAuthHeaders()
    console.log('Auth headers being sent:', authHeaders)
    return {
        headers: {
            ...headers,
            ...authHeaders
        }
    }
})

// Split link - use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    ApolloLink.from([errorLink, authLink, httpLink])
)

// Create Apollo Client
export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all'
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all'
        }
    }
})