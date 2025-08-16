// src/components/AuthForm.jsx
import { useState } from 'react'
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { signInEmailPassword, isLoading: loginLoading } = useSignInEmailPassword()
    const { signUpEmailPassword, isLoading: signupLoading } = useSignUpEmailPassword()

    const validateForm = () => {
        setError('')

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return false
        }

        // Password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setError('')
        setSuccess('')

        try {
            let result
            if (isLogin) {
                console.log('Attempting login with:', email)
                result = await signInEmailPassword(email, password)
                console.log('Login result:', result)
            } else {
                console.log('Attempting signup with:', email)
                result = await signUpEmailPassword(email, password, {
                    displayName: email.split('@')[0],
                    metadata: {
                        createdAt: new Date().toISOString()
                    }
                })
                console.log('Signup result:', result)
            }

            if (result.error) {
                console.error('Auth error:', result.error)
                if (result.error.message.includes('already exists')) {
                    setError('An account with this email already exists. Please sign in.')
                } else if (result.error.message.includes('Invalid email or password')) {
                    setError('Invalid email or password. Please check your credentials.')
                } else if (result.error.message.includes('Password')) {
                    setError('Password must be at least 6 characters long')
                } else {
                    setError(result.error.message || 'Authentication failed. Please try again.')
                }
            } else if (!isLogin && result.isSuccess) {
                setSuccess('Account created successfully! Signing you in...')
                setTimeout(async () => {
                    const loginResult = await signInEmailPassword(email, password)
                    if (loginResult.error) {
                        setError('Account created but login failed. Please try signing in manually.')
                        setSuccess('')
                    }
                }, 1000)
            }
        } catch (err) {
            console.error('Unexpected auth error:', err)
            setError('An unexpected error occurred. Please try again.')
        }
    }

    const switchMode = () => {
        setIsLogin(!isLogin)
        setError('')
        setSuccess('')
        setPassword('')
    }

    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
            {/* Animated background elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
                <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
                <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>
            </div>

            {/* Floating particles */}
            <div className='absolute inset-0 overflow-hidden'>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-1 h-1 bg-white rounded-full opacity-30'
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 20}s`,
                            animationDuration: `${20 + Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>

            <div className='relative z-10 max-w-md w-full mx-4'>
                <div className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden'>
                    {/* Glassmorphism overlay */}
                    <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl'></div>

                    <div className='relative z-10'>
                        <div className='text-center mb-8'>
                            <div className='relative mb-6'>
                                <div className='bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300'>
                                    <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                                    </svg>
                                </div>
                                <div className='absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse'></div>
                            </div>
                            <h1 className='text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2'>
                                AI Chatbot
                            </h1>
                            <h2 className='text-xl text-gray-300 font-light'>
                                {isLogin ? 'Welcome back! 👋' : 'Join us today! ✨'}
                            </h2>
                        </div>

                        {error && (
                            <div className='bg-red-500/20 border border-red-500/30 backdrop-blur-sm text-red-200 px-4 py-3 rounded-xl mb-4 flex items-start animate-shake'>
                                <svg className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                                </svg>
                                <p className='text-sm'>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className='bg-green-500/20 border border-green-500/30 backdrop-blur-sm text-green-200 px-4 py-3 rounded-xl mb-4 flex items-start animate-bounce-in'>
                                <svg className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                <p className='text-sm'>{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='group'>
                                <label className='block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400'>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <input
                                        type='email'
                                        placeholder='you@example.com'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                                        className='w-full px-4 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/20 outline-none transition-all duration-300'
                                        required
                                        autoComplete='email'
                                    />
                                    <svg className='w-5 h-5 text-gray-400 absolute left-4 top-4.5 transition-colors group-focus-within:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                            </div>

                            <div className='group'>
                                <label className='block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        type='password'
                                        placeholder='••••••••'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='w-full px-4 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/20 outline-none transition-all duration-300'
                                        required
                                        minLength={6}
                                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    />
                                    <svg className='w-5 h-5 text-gray-400 absolute left-4 top-4.5 transition-colors group-focus-within:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                </div>
                                <p className='text-xs text-gray-400 mt-2'>
                                    {!isLogin && 'Password must be at least 6 characters long'}
                                    {isLogin && password.length > 0 && password.length < 6 && (
                                        <span className='text-red-400'>Password too short</span>
                                    )}
                                </p>
                            </div>

                            <button
                                type='submit'
                                disabled={loginLoading || signupLoading || !email || !password}
                                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                                {loginLoading || signupLoading ? (
                                    <span className='flex items-center justify-center relative z-10'>
                                        <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className='relative z-10'>
                                        {isLogin ? 'Sign In ✨' : 'Create Account 🚀'}
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className='mt-8'>
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-white/20'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-4 bg-transparent text-gray-400'>or</span>
                                </div>
                            </div>

                            <div className='mt-6 text-center'>
                                <p className='text-sm text-gray-300'>
                                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                    {' '}
                                    <button
                                        onClick={switchMode}
                                        className='text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200'
                                    >
                                        {isLogin ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </p>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className='mt-6 p-4 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl'>
                                <p className='text-xs text-blue-200 text-center'>
                                    By creating an account, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
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
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes bounce-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}