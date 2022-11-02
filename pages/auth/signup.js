import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { getSession } from 'next-auth/react';
import Simple from '../../src/components/Templates/Simple/Simple'
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
    throw new Error(data.message || 'Something went wrong!')
  }
  return data
}

export default function Home() {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const nameInputRef = useRef()
  const router = useRouter()
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/profile/view')
      } else {
        setIsLoading(false)
      }
    })
  }, [router])
  const moveToLogin = () => {
    router.replace('/auth/signin')
  }
  const submitHandler = async (event) => {
    event.preventDefault()
    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value
    const enteredName = nameInputRef.current.value
    try {
      const result = await createUser(
        enteredName,
        enteredEmail,
        enteredPassword,
      )
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Simple>
      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={submitHandler}>
          <div>
            <label
              className="block font-large text-sm text-gray-700 "
              for="name"
            >
              Name
            </label>

            <input
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
              for="email"
            >
              Email
            </label>

            <input
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
              for="password"
            >
              Password
            </label>

            <input
              ref={passwordInputRef}
              className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
              id="password"
              type="password"
              name="password"
              required="required"
              autocomplete="new-password"
            />
          </div>

          <div className="mt-4">
            <label
              className="block font-large text-sm text-gray-700"
              for="password_confirmation"
            >
              Confirm Password
            </label>

            <input
              className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1  p-2 w-full"
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              required="required"
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <a
              className="underline text-sm text-gray-600 hover:text-gray-900"
              onClick={moveToLogin}
            >
              Already registered?
            </a>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-4"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </Simple>
  )
}
