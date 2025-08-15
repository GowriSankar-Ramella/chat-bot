// src/components/ChatList.jsx
import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS, CREATE_CHAT, DELETE_CHAT } from '../graphql/queries'
import { useSignOut, useUserData } from '@nhost/react'

export default function ChatList({ selectedChat, onSelectChat }) {
    const { data, loading, error } = useQuery(GET_CHATS, {
        pollInterval: 5000 // Poll every 5 seconds for updates
    })
    const userData = useUserData()
    const { signOut } = useSignOut()

    const [createChat] = useMutation(CREATE_CHAT, {
        refetchQueries: [GET_CHATS]
    })

    const [deleteChat] = useMutation(DELETE_CHAT, {
        refetchQueries: [GET_CHATS]
    })

    const handleNewChat = async () => {
        try {
            const { data } = await createChat({
                variables: {
                    title: 'New Chat',
                    user_id: userData?.id
                }
            })
            if (data?.insert_chats_one?.id) {
                onSelectChat(data.insert_chats_one.id)
            }
        } catch (err) {
            console.error('Error creating chat:', err)
        }
    }

    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation() // Prevent selecting the chat
        if (window.confirm('Are you sure you want to delete this chat?')) {
            try {
                await deleteChat({
                    variables: { chat_id: chatId }
                })
                if (selectedChat === chatId) {
                    onSelectChat(null)
                }
            } catch (err) {
                console.error('Error deleting chat:', err)
            }
        }
    }

    const handleSignOut = async () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            await signOut()
        }
    }

    if (loading) return (
        <div className='w-80 bg-gray-900 h-screen p-4'>
            <div className='animate-pulse'>
                <div className='h-12 bg-gray-700 rounded mb-4'></div>
                <div className='space-y-2'>
                    <div className='h-16 bg-gray-700 rounded'></div>
                    <div className='h-16 bg-gray-700 rounded'></div>
                </div>
            </div>
        </div>
    )

    if (error) return (
        <div className='w-80 bg-gray-900 h-screen p-4 text-white'>
            <p>Error loading chats</p>
        </div>
    )

    return (
        <div className='w-80 bg-gray-900 h-screen flex flex-col'>
            {/* Header */}
            <div className='p-4 border-b border-gray-700'>
                <button
                    onClick={handleNewChat}
                    className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
                >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    New Chat
                </button>
            </div>

            {/* Chat List */}
            <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                {data?.chats?.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`group p-3 rounded-lg cursor-pointer transition-all ${selectedChat === chat.id
                            ? 'bg-gray-700 border border-gray-600'
                            : 'bg-gray-800 hover:bg-gray-750 border border-transparent'
                            }`}
                    >
                        <div className='flex items-start justify-between'>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-medium text-white truncate'>
                                    {chat.title}
                                </h3>
                                <p className='text-sm text-gray-400 truncate mt-1'>
                                    {chat.messages[0]?.content || 'No messages yet'}
                                </p>
                            </div>
                            <button
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all ml-2'
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {(!data?.chats || data.chats.length === 0) && (
                    <div className='text-center text-gray-400 mt-8'>
                        <svg className='w-12 h-12 mx-auto mb-3 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                        </svg>
                        <p>No chats yet</p>
                        <p className='text-sm mt-1'>Create one to get started!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-gray-700'>
                <div className='flex items-center gap-3 mb-3 text-gray-300'>
                    <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm truncate'>{userData?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className='w-full text-gray-400 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm'
                >
                    Sign Out
                </button>
            </div>
        </div>
    )
}