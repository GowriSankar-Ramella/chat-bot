// src/lib/nhost.js
import { NhostClient } from '@nhost/nhost-js'

export const nhost = new NhostClient({
    subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
    region: import.meta.env.VITE_NHOST_REGION
})

// Log to verify connection (remove in production)
console.log('Nhost initialized with:', {
    subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
    region: import.meta.env.VITE_NHOST_REGION,
    graphqlUrl: nhost.graphql.getUrl()
})