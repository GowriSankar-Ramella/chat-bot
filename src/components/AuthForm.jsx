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
                    displayName: email.split('@')[0], // Use email prefix as display name
                    metadata: {
                        createdAt: new Date().toISOString()
                    }
                })
                console.log('Signup result:', result)
            }

            if (result.error) {
                console.error('Auth error:', result.error)
                // Handle specific error messages
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
                // Auto-login after successful signup
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
        // Clear password when switching modes for security
        setPassword('')
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
            <div className='max-w-md w-full mx-4'>
                <div className='bg-white rounded-xl shadow-xl p-8'>
                    <div className='text-center mb-8'>
                        <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
                            AI Chatbot
                        </h1>
                        <h2 className='text-xl text-gray-600'>
                            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                        </h2>
                    </div>

                    {error && (
                        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start'>
                            <svg className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                            </svg>
                            <p className='text-sm'>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start'>
                            <svg className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                            </svg>
                            <p className='text-sm'>{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <input
                                    type='email'
                                    placeholder='you@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                                    className='w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                                    required
                                    autoComplete='email'
                                />
                                <svg className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Password
                            </label>
                            <div className='relative'>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                                    required
                                    minLength={6}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                />
                                <svg className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                                {!isLogin && 'Password must be at least 6 characters long'}
                                {isLogin && password.length > 0 && password.length < 6 && (
                                    <span className='text-red-500'>Password too short</span>
                                )}
                            </p>
                        </div>

                        <button
                            type='submit'
                            disabled={loginLoading || signupLoading || !email || !password}
                            className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.02]'
                        >
                            {loginLoading || signupLoading ? (
                                <span className='flex items-center justify-center'>
                                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>or</span>
                            </div>
                        </div>

                        <div className='mt-6 text-center'>
                            <p className='text-sm text-gray-600'>
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                {' '}
                                <button
                                    onClick={switchMode}
                                    className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                            <p className='text-xs text-blue-700 text-center'>
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}