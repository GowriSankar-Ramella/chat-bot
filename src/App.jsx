// src/App.jsx
import { useState, useEffect } from 'react'
import { NhostProvider, useAuthenticationStatus } from '@nhost/react'
import { ApolloProvider } from '@apollo/client'
import { nhost } from './lib/nhost'
import { apolloClient } from './lib/apollo'
import AuthForm from './components/AuthForm'
import ChatList from './components/ChatList'
import MessageView from './components/MessageView'
import './App.css'

function AppContent() {
  const { isAuthenticated, isLoading, isError } = useAuthenticationStatus()
  const [selectedChat, setSelectedChat] = useState(null)

  // Handle auth errors
  useEffect(() => {
    if (isError) {
      console.log('Authentication error detected, clearing session...')
      // Clear any stale auth data
      nhost.auth.signOut()
    }
  }, [isError])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <svg className='animate-spin h-12 w-12 text-blue-600 mx-auto' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
          <p className='mt-4 text-gray-600 text-lg'>Loading application...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <ChatList
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <MessageView chatId={selectedChat} />
    </div>
  )
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <AppContent />
      </ApolloProvider>
    </NhostProvider>
  )
}

export default App