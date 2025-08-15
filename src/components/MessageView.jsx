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
            // Bot typing indicator will show until response arrives
            setTimeout(() => setIsTyping(false), 3000) // Fallback timeout
        } catch (error) {
            console.error('Error sending message:', error)
            setMessage(messageText) // Restore message on error
            setIsTyping(false)
            alert('Failed to send message. Please try again.')
        }
    }

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        // Hide typing indicator when assistant message arrives
        if (data?.messages?.some(m => m.role === 'assistant')) {
            setIsTyping(false)
        }
    }, [data?.messages])

    if (!chatId) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
                <div className='text-center max-w-md'>
                    <div className='bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-10 h-10 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                        </svg>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                        Welcome to AI Chatbot
                    </h3>
                    <p className='text-gray-600'>
                        Select a chat from the sidebar or create a new one to start chatting with AI
                    </p>
                </div>
            </div>
        )
    }

    if (loading && !data) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
                <div className='text-center'>
                    <svg className='animate-spin h-10 w-10 text-blue-600 mx-auto' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <p className='mt-4 text-gray-600'>Loading messages...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
                <div className='text-center text-red-600'>
                    <p>Error loading messages</p>
                    <p className='text-sm mt-2'>{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col bg-gray-50'>
            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-4'>
                <div className='max-w-3xl mx-auto space-y-4'>
                    {data?.messages?.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'
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
                                <div
                                    className={`px-4 py-2 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                                        }`}
                                >
                                    <pre className='whitespace-pre-wrap font-sans text-sm'>{msg.content}</pre>
                                    <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className='flex justify-start'>
                            <div className='flex gap-3 max-w-[70%]'>
                                <div className='w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <div className='bg-white text-gray-800 shadow-sm border border-gray-200 px-4 py-2 rounded-2xl'>
                                    <div className='flex space-x-1'>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className='border-t bg-white'>
                <form onSubmit={handleSubmit} className='max-w-3xl mx-auto p-4'>
                    <div className='flex gap-3'>
                        <input
                            type='text'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder='Type your message...'
                            className='flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                            disabled={sending}
                            autoFocus
                        />
                        <button
                            type='submit'
                            disabled={sending || !message.trim()}
                            className='bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
                        >
                            {sending ? (
                                <>
                                    <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send</span>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}