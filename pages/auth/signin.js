import Simple from '../../src/components/Templates/Simple/Simple'
import { useEffect, useRef, useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { gerSession } from 'next-auth/react'
import Link from 'next/link'
import Logo from '../../src/components/Layout/Logo/Logo'
export default function Home() {
  const [isChecking, setIsChecking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
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

  if (isLoading) {
    return <p className="center">Loading...</p>
  }
  const submitHandler = async (event) => {
    event.preventDefault()
    if (isChecking) {
      return
    }
    setIsChecking(true)
    const result = await signIn('credentials', {
      redirect: false,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    })
    setIsChecking(false)
    console.log(result)
    if (!result.error) {
      router.replace('/profile/view')
    }
  }
  return (
    <Simple >
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
              <span className=" text-6xl text-red-600 font-bold">Fuel</span>{' '}
              <span className=" text-6xl font-semibold">Monitor</span>
            </p>
          </Link>
        </div>
      </div>
      <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={submitHandler}>
          <input
            type="hidden"
            name="_token"
            value="GqCq0YxfyhjPQxzceh7BL3cXQLGz9LZIUpT5MtF3"
          />
          <div>
            <label class="block font-large text-sm text-gray-700" for="email">
              Email
            </label>

            <input
              class="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
              id="email"
              type="email"
              name="email"
              required="required"
              autofocus="autofocus"
              ref={emailInputRef}
            />
          </div>

          <div class="mt-4">
            <label
              class="block font-large text-sm text-gray-700"
              for="password"
            >
              Password
            </label>

            <input
              class="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2  w-full"
              id="password"
              type="password"
              name="password"
              required="required"
              autocomplete="current-password"
              ref={passwordInputRef}
            />
          </div>

          <div class="flex items-center justify-end mt-4">
            {/* <a
              class="underline text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot your password?
            </a> */}

            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-3"
            >
              {isChecking && (
                <svg
                  aria-hidden="true"
                  class="mr-3 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
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
              {isChecking && 'Logging in...'}
              {!isChecking && 'Login'}
            </button>
          </div>
        </form>
      </div>
    </Simple>
  )
}
