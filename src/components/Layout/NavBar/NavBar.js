import Head from 'next/head'
import Link from 'next/link'
import { useSession, getSession, signOut } from 'next-auth/react'

import { useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import { app } from '../../../config/app'
import {BsFillGrid3X3GapFill} from 'react-icons/bs'

export default function NavBar() {
  const { data: session, status } = useSession()

  const [navbar, setNavbar] = useState(false)
  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  useEffect(() => {
    console.log('Open', open)
  }, [open])
  useEffect(() => {
    console.log('openMobile', openMobile)
  }, [openMobile])
  if (status === 'loading') {
    return
  }

  if (status === 'unauthenticated') {
    return 
  }
  function logoutHandler() {
    signOut();
  }
  console.log(session)
  return (
    <nav x-data="{ open: false }" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0  items-center">
              <Link href="/">
                <span className='block'>
                <Logo className="p-2 m-3 w-auto" /> 
                </span>
              </Link>
            </div>
            <div className="shrink-0  items-center space-x-8 flex">
              <Link href="/" >
                <p><span className='text-red-600 text-xl font-bold'>Fuel</span>  <span className='font-bold text-xl'>Monitor</span></p>
              </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <Link
                className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
                href={"/"}
              >
                The Garage
              </Link>
            </div>
          </div>
          {session && (
            <div
              className={`${
                open ? '' : 'hidden'
              } sm:flex sm:items-center sm:ml-6 hidden xs:block`}
            >
              <div className="relative">
                <div
                  onClick={() => {
                    setOpen(!open)
                    console.log('Open', open)
                  }}
                >
                  <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                    <div>{session.user.name? session.user.name : "Unnamed"}</div>

                    <div className="ml-1"></div>
                  </button>
                </div>

                <div
                  className={`${
                    open ? '' : 'hidden'
                  }  absolute z-50 mt-2 w-48 rounded-md shadow-lg origin-top-right right-0`}
                  onClick={() => {
                    setOpen(!open)
                  }}
                >
                  <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
                    <form
                      method="POST"
                      action="https://ledger.myphpnotes.com/logout"
                    >
                      <input
                        type="hidden"
                        name="_token"
                        value="2rkZpQgQDeM4mZXRFkmCkrRyuDPbOFsHvjRekxaD"
                      />
                      <a
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => {
                setOpenMobile(!openMobile)
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              <BsFillGrid3X3GapFill/>
            </button>
          </div>
        </div>
      </div>

      <div className={`${openMobile ? '' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            className="block pl-3 pr-4 py-2 border-l-4 border-indigo-400 text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out"
            href="/"
          >
            The Garage
          </Link>
        </div>

        <div className="pt-4 pb-1 border-t border-gray-200">
          <div className="px-4">
            <div className="font-medium text-base text-gray-800">
            {session.user.name? session.user.name : "Unnamed"}
            </div>
            <div className="font-medium text-sm text-gray-500">
            {session.user.email? session.user.email : "No Email :("}
            </div>
          </div>

          <div className="mt-3 space-y-1"></div>
          <div className="pt-2 pb-3 space-y-1  border-t">
            <a
              className="block pl-3 pr-4 py-2 hover:border-l-4 hover:border-indigo-400 text-base font-medium hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out"
              onClick={logoutHandler}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  if (!session) {
      return {
          redirect: {
              destination: '/auth/signin',
              permanent: false,
          },
      }
  }
  return {
      props: { session },
  }
}
