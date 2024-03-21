import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { getSession } from 'next-auth/react'
import Simple from '../../src/components/Templates/Simple/Simple'
import Link from 'next/link'
import Logo from '../../src/components/Layout/Logo/Logo'
import { toast } from 'react-toastify'
import Loading from '../../src/components/Layout/Loading/Loading'

async function createUser(name, email, password) {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    if (!response.ok) {
        if (data.message === 'User exists already!') {
            toast.info("You're already registered. Please Login. 😊", {
                position: 'bottom-center',
            })
        } else {
            toast.error('Something went wrong. 😶', {
                position: 'bottom-center',
            })
        }
    } else {
        toast.success(
            'Account created successfully. Moving you to the login page... 😊',
            {
                position: 'bottom-center',
            }
        )
    }
    return data
}

export default function Home() {
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

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
    const submitHandler = async (event) => {
        event.preventDefault()
        setIsCreating(true)
        const enteredEmail = emailInputRef.current.value
        const enteredPassword = passwordInputRef.current.value
        const enteredName = nameInputRef.current.value
        try {
            const result = await createUser(
                enteredName,
                enteredEmail,
                enteredPassword
            )
            if (result.message == 'Created user!') {
                setTimeout(() => {
                    router.replace('/auth/forgot')
                }, 2000)
            }
        } catch (error) {}
        setIsCreating(false)
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
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={submitHandler}>
                    <div>
                        <label
                            className="block font-large text-sm text-gray-700 "
                            htmlFor="name"
                        >
                            Name
                        </label>

                        <input
                            placeholder="Bob"
                            ref={nameInputRef}
                            className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                            id="name"
                            type="text"
                            name="name"
                            required="required"
                            autofocus="autofocus"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            className="block font-large text-sm text-gray-700"
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <input
                            placeholder="bob@somwhere.com"
                            ref={emailInputRef}
                            className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1  p-2 w-full"
                            id="email"
                            type="email"
                            name="email"
                            required="required"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            className="block font-large text-sm text-gray-700"
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            ref={passwordInputRef}
                            className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                            id="password"
                            type="text"
                            placeholder="●●●●●●●●"
                            name="password"
                            required="required"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <a
                            className="cursor-pointer underline text-sm text-gray-600 hover:text-gray-900"
                            onClick={moveToLogin}
                        >
                            Already registered?
                        </a>

                        <button
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
                            {!isCreating && 'Register'}
                            {isCreating && 'Registering...'}
                        </button>
                    </div>
                </form>
            </div>
        </Simple>
    )
}
