// src/components/ChatList.jsx
import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS, CREATE_CHAT, DELETE_CHAT } from '../graphql/queries'
import { useSignOut, useUserData } from '@nhost/react'

export default function ChatList({ selectedChat, onSelectChat }) {
    const { data, loading, error } = useQuery(GET_CHATS, {
        pollInterval: 5000
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
        e.stopPropagation()
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
        <div className='w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-screen p-4'>
            <div className='animate-pulse space-y-4'>
                <div className='h-14 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl'></div>
                <div className='space-y-3'>
                    <div className='h-16 bg-slate-700/30 rounded-xl'></div>
                    <div className='h-16 bg-slate-700/30 rounded-xl'></div>
                    <div className='h-16 bg-slate-700/30 rounded-xl'></div>
                </div>
            </div>
        </div>
    )

    if (error) return (
        <div className='w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-screen p-4 text-white flex items-center justify-center'>
            <div className='text-center'>
                <div className='w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <svg className='w-6 h-6 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                </div>
                <p className='text-red-400'>Error loading chats</p>
            </div>
        </div>
    )

    return (
        <div className='w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col relative overflow-hidden'>
            {/* Background gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20'></div>

            {/* Header */}
            <div className='relative z-10 p-4 border-b border-white/10'>
                <div className='flex items-center gap-3 mb-4'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                        </svg>
                    </div>
                    <div>
                        <h1 className='text-lg font-semibold text-white'>AI Chat</h1>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                            <span className='text-xs text-gray-400'>Online</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleNewChat}
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group'
                >
                    <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                    <svg className='w-5 h-5 relative z-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    <span className='relative z-10 font-medium'>New Chat</span>
                </button>
            </div>

            {/* Chat List */}
            <div className='flex-1 overflow-y-auto p-4 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800'>
                {data?.chats?.map((chat, index) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden border ${selectedChat === chat.id
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                            }`}
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'slideInUp 0.5s ease-out forwards'
                        }}
                    >
                        {selectedChat === chat.id && (
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl'></div>
                        )}

                        <div className='flex items-start justify-between relative z-10'>
                            <div className='flex-1 min-w-0 pr-3'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <div className={`w-2 h-2 rounded-full ${selectedChat === chat.id ? 'bg-blue-400' : 'bg-gray-500'
                                        }`}></div>
                                    <h3 className='font-medium text-white truncate text-sm'>
                                        {chat.title}
                                    </h3>
                                </div>
                                <p className='text-xs text-gray-400 truncate leading-relaxed'>
                                    {chat.messages[0]?.content || 'No messages yet'}
                                </p>
                                <div className='flex items-center gap-2 mt-2'>
                                    <svg className='w-3 h-3 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    <span className='text-xs text-gray-500'>
                                        {new Date(chat.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-300 p-1 rounded-lg hover:bg-red-500/10'
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {(!data?.chats || data.chats.length === 0) && (
                    <div className='text-center text-gray-400 mt-12 animate-fade-in'>
                        <div className='w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                            </svg>
                        </div>
                        <p className='text-lg font-medium mb-2'>No chats yet</p>
                        <p className='text-sm text-gray-500'>Start a conversation to get going! ✨</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-white/10 relative z-10'>
                <div className='flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10'>
                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                        <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900'></div>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-white truncate'>{userData?.email}</p>
                        <p className='text-xs text-gray-400'>Premium User</p>
                    </div>
                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                </div>
                <button
                    onClick={handleSignOut}
                    className='w-full text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 border border-white/10 hover:border-white/20'
                >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    Sign Out
                </button>
            </div>

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
                    background-color: rgb(71 85 105);
                    border-radius: 2px;
                }
                .scrollbar-track-slate-800::-webkit-scrollbar-track {
                    background-color: rgb(30 41 59);
                }
            `}</style>
        </div>
    )
}