import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Simple from '../../src/components/Templates/Simple/Simple'
import Link from 'next/link'
import Logo from '../../src/components/Layout/Logo/Logo'
import { toast } from 'react-toastify'
import Loading from '../../src/components/Layout/Loading/Loading'
import { getSession, signIn } from 'next-auth/react'

async function sendPasswordResetInstructions(email) {
    return await fetch('/api/auth/loginotp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => response.json())
}
async function loginByCode(email, code) {
    const result = await signIn('credentials', {
        redirect: false,
        email: email,
        loginOtp: code,
    })
    return result
}

export default function Home() {
    const [isCreating, setIsCreating] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isOtpSent, setIsOtpSent] = useState(false)

    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const nameInputRef = useRef()
    const router = useRouter()
    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                router.replace('/')
            } else {
                setIsLoading(false)
            }
        })
    }, [router])
    if (isLoading) {
        return <Loading />
    }
    const moveToLogin = () => {
        router.replace('/auth/forgot')
    }
    const sendOtp = async (event) => {
        event.preventDefault()
        setIsCreating(true)
        const enteredEmail = emailInputRef.current.value

        try {
            const result = await sendPasswordResetInstructions(enteredEmail)
            if (!!result.success) {
                setIsOtpSent(true)
            }
        } catch (error) {}
        setIsCreating(false)
    }
    const verifyOtp = async (event) => {
        event.preventDefault()
        setIsVerifying(true)
        const enteredEmail = emailInputRef.current.value
        const enteredPassword = passwordInputRef.current.value

        try {
            const result = await loginByCode(enteredEmail, enteredPassword)

            if (!result.error) {
                toast.success('Welcome back, Speed. 🚀', {
                    position: 'bottom-center',
                })
                router.replace('/')
                return
            }
        } catch (error) {}
        setIsVerifying(false)
        setIsOtpSent(true)
        toast.error('Invalid OTP. Please try again.', {
            position: 'bottom-center',
        })
        // Clear the password
        passwordInputRef.current.value = ''
    }
    return (
        <Simple>
            <div>
                <div className="shrink-0  items-center">
                    <Link href="/">
                        <span className="block">
                            <Logo className="p-2 m-3 w-auto" />
                        </span>
                    </Link>
                </div>
                <div className="shrink-0  items-center  ">
                    <Link href="/">
                        <p>
                            <span className=" text-6xl text-red-600 font-bold">
                                Fuel
                            </span>{' '}
                            <span className=" text-6xl font-semibold">
                                Monitor
                            </span>
                        </p>
                    </Link>
                </div>
            </div>
            <div className="w-11/12 sm:max-w-md mt-6 mb-2 px-6 m-10 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div className="mt-4">
                    <label
                        className="block font-large text-sm text-gray-700"
                        htmlFor="email"
                    >
                        Email
                    </label>

                    <input
                        placeholder="bob@somewhere.com"
                        readOnly={isOtpSent}
                        ref={emailInputRef}
                        className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1  p-2 w-full"
                        id="email"
                        type="email"
                        name="email"
                        required="required"
                    />
                </div>

                {isOtpSent && (
                    <div>
                        <div className="mt-4">
                            <label
                                className="block font-large text-sm text-gray-700"
                                htmlFor="password"
                            >
                                4-digit code
                            </label>

                            <input
                                ref={passwordInputRef}
                                className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                id="password"
                                type="string"
                                minLength={4}
                                maxLength={4}
                                onChange={(e) => {
                                    // do not allow non-numeric characters
                                    e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ''
                                    )
                                }}
                                placeholder="●●●●"
                                name="password"
                                required="required"
                                autoComplete="new-password"
                            />
                        </div>
                        <div
                            className="flex items-center mt-4 bg-blue-500 text-white text-sm font-bold px-4 py-3"
                            role="alert"
                        >
                            <svg
                                className="fill-current w-4 h-4 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                            </svg>
                            <p>We have sent you a login code to your email.</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end mt-4">
                    {!isOtpSent && (
                        <button
                            onClick={sendOtp}
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4"
                        >
                            {isCreating && (
                                <svg
                                    aria-hidden="true"
                                    className="mr-3 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}
                            {!isCreating && 'Send OTP'}
                            {isCreating && 'Sending...'}
                        </button>
                    )}
                    {isOtpSent && (
                        <div>
                            <Link
                                href="/auth/forgot"
                                className="underline text-sm text-red-600 hover:text-gray-900"
                            >
                                Back
                            </Link>
                            <button
                                onClick={verifyOtp}
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4"
                            >
                                {isVerifying && (
                                    <svg
                                        aria-hidden="true"
                                        className="mr-3 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                )}
                                {!isVerifying && 'Verify'}
                                {isVerifying && 'Verifying...'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Simple>
    )
}
