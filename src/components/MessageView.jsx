// src/components/MessageView.jsx
import { useState, useRef, useEffect } from 'react'
import { useSubscription, useMutation } from '@apollo/client'
import { MESSAGES_SUBSCRIPTION, SEND_MESSAGE } from '../graphql/queries'

export default function MessageView({ chatId }) {
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const { data, loading, error } = useSubscription(MESSAGES_SUBSCRIPTION, {
        variables: { chat_id: chatId },
        skip: !chatId,
    })

    const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!message.trim() || !chatId) return

        const messageText = message
        setMessage('')
        setIsTyping(true)

        try {
            await sendMessage({
                variables: {
                    message: messageText,
                    chat_id: chatId
                }
            })
            setTimeout(() => setIsTyping(false), 3000)
        } catch (error) {
            console.error('Error sending message:', error)
            setMessage(messageText)
            setIsTyping(false)
            alert('Failed to send message. Please try again.')
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        if (data?.messages?.some(m => m.role === 'assistant')) {
            setIsTyping(false)
        }
    }, [data?.messages])

    if (!chatId) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden'>
                {/* Animated background elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob'></div>
                    <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000'></div>
                    <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000'></div>
                </div>

                <div className='text-center max-w-md relative z-10'>
                    <div className='relative mb-8'>
                        <div className='bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500'>
                            <svg className='w-12 h-12 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                            </svg>
                        </div>
                        <div className='absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse shadow-lg'></div>
                        <div className='absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping'></div>
                    </div>
                    <h3 className='text-3xl font-bold text-gray-800 mb-4'>
                        Welcome to AI Chat ✨
                    </h3>
                    <p className='text-gray-700 text-lg leading-relaxed mb-6'>
                        Click "New Chat" in the sidebar to start your conversation with AI
                    </p>
                    <div className='bg-white/90 backdrop-blur-sm border border-blue-200 rounded-xl p-4 mb-8 shadow-lg'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <div>
                                <p className='text-blue-600 font-medium text-sm'>Getting Started</p>
                                <p className='text-gray-600 text-xs'>Create a new chat to begin messaging</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 flex justify-center gap-6'>
                        <div className='text-center'>
                            <div className='w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2'>
                                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                                </svg>
                            </div>
                            <p className='text-xs text-gray-600'>Fast</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-2'>
                                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <p className='text-xs text-gray-600'>Smart</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-2'>
                                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                                </svg>
                            </div>
                            <p className='text-xs text-gray-600'>Helpful</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading && !data) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'>
                <div className='text-center'>
                    <div className='relative'>
                        <svg className='animate-spin h-12 w-12 text-blue-500 mx-auto' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-ping'></div>
                    </div>
                    <p className='mt-6 text-gray-400 text-lg'>Loading messages...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    </div>
                    <p className='text-red-400 text-lg font-medium'>Error loading messages</p>
                    <p className='text-gray-500 text-sm mt-2'>{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative overflow-hidden'>
            {/* Background effects */}
            <div className='absolute inset-0 opacity-50'>
                <div className='absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
                <div className='absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent'>
                <div className='max-w-4xl mx-auto space-y-6'>
                    {data?.messages?.map((msg, index) => (
                        <div
                            key={msg.id}
                            className={`flex animate-message-slide-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                    : 'bg-gradient-to-r from-slate-700 to-slate-600'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                        </svg>
                                    ) : (
                                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                        </svg>
                                    )}
                                </div>
                                <div className={`relative max-w-full ${msg.role === 'user' ? 'order-first' : ''}`}>
                                    <div
                                        className={`px-6 py-4 rounded-2xl backdrop-blur-sm relative overflow-hidden ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                                            : 'bg-white/90 text-gray-800 shadow-lg border border-white/20'
                                            }`}
                                    >
                                        {/* Message glow effect */}
                                        {msg.role === 'user' && (
                                            <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl'></div>
                                        )}

                                        <pre className='whitespace-pre-wrap font-sans text-sm leading-relaxed relative z-10'>{msg.content}</pre>

                                        <div className={`text-xs mt-3 relative z-10 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            <div className='flex items-center gap-2'>
                                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className='flex justify-start animate-fade-in'>
                            <div className='flex gap-4 max-w-[80%]'>
                                <div className='w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg'>
                                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <div className='bg-white/90 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl shadow-lg'>
                                    <div className='flex space-x-2'>
                                        <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area - ENABLED when chatId exists and valid */}
            <div className='border-t border-white/10 bg-slate-900/50 backdrop-blur-xl relative z-10'>
                <form onSubmit={handleSubmit} className='max-w-4xl mx-auto p-6'>
                    <div className='flex gap-4 items-end'>
                        <div className='flex-1 relative'>
                            <input
                                type='text'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={!chatId ? 'Please create a new chat first to start messaging...' : 'Type your message here...'}
                                className={`w-full px-6 py-4 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${!chatId
                                    ? 'bg-white/5 border-white/10 text-gray-500 placeholder-gray-500 cursor-not-allowed'
                                    : `bg-white/10 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/15 ${sending ? 'opacity-50' : ''}`
                                    }`}
                                disabled={!chatId || sending}
                            />
                            {!chatId && (
                                <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                </div>
                            )}
                            {sending && chatId && (
                                <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                                    <svg className='animate-spin h-5 w-5 text-blue-400' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={!chatId || sending || !message.trim()}
                            className={`p-4 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg ${!chatId || sending || !message.trim()
                                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                                }`}
                        >
                            {!chatId ? (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                            ) : (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                                </svg>
                            )}
                            {sending && chatId && <span className='text-sm'>Sending...</span>}
                        </button>
                    </div>

                    {/* Quick actions - ENABLED only when chatId exists */}
                    <div className='flex gap-2 mt-4'>
                        <button
                            type='button'
                            onClick={() => chatId && setMessage('👋 Hello! How are you?')}
                            disabled={!chatId}
                            className={`text-xs px-3 py-2 rounded-lg transition-colors border ${!chatId
                                ? 'bg-white/5 text-gray-500 border-white/10 opacity-50 cursor-not-allowed'
                                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                                }`}
                        >
                            👋 Say Hello
                        </button>
                        <button
                            type='button'
                            onClick={() => chatId && setMessage('How do you work?')}
                            disabled={!chatId}
                            className={`text-xs px-3 py-2 rounded-lg transition-colors border ${!chatId
                                ? 'bg-white/5 text-gray-500 border-white/10 opacity-50 cursor-not-allowed'
                                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                                }`}
                        >
                            🤔 How do you work?
                        </button>
                        <button
                            type='button'
                            onClick={() => chatId && setMessage('What can you help me with?')}
                            disabled={!chatId}
                            className={`text-xs px-3 py-2 rounded-lg transition-colors border ${!chatId
                                ? 'bg-white/5 text-gray-500 border-white/10 opacity-50 cursor-not-allowed'
                                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                                }`}
                        >
                            ✨ What can you do?
                        </button>
                    </div>

                    {/* Call to action when no chat */}
                    {!chatId && (
                        <div className='mt-4 text-center'>
                            <p className='text-gray-500 text-sm'>
                                ← Click "New Chat" in the sidebar to start a conversation
                            </p>
                        </div>
                    )}
                </form>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes message-slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-message-slide-in {
                    animation: message-slide-in 0.5s ease-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
                    background-color: rgb(71 85 105);
                    border-radius: 2px;
                }
                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background-color: transparent;
                }
            `}</style>
        </div>
    )
}