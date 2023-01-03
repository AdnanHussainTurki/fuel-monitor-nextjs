import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRef, useState, useEffect } from 'react'
import Auth from '../../src/components/Templates/Auth/Auth'
import Loading from '../../src/components/Layout/Loading/Loading'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import { useStoreState } from 'pullstate'
import AccountStore from '../../src/stores/AccountStore'
import BalanceBar from '../../src/components/Layout/BalanceBar/BalanceBar'
import Link from 'next/link'
import { MdArrowBack } from 'react-icons/md'


export default function add() {
    const { active, account, activate, library } = useWeb3React()
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const accountInputRef = useRef()
    const nameInputRef = useRef();

    const router = useRouter()
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/compromised/add')
            }
        })
    }, [router])
    useEffect(() => {
        if (!active) {
            router.replace('/')
        }
    }, [active])


    const submitHandler = async (event) => {
        event.preventDefault()
        if (isAdding) {
            return
        }
        setIsAdding(true)
        const enteredAccount = accountInputRef.current.value
        const enteredName = nameInputRef.current.value

        if (enteredName.trim().length === 0) {
            setIsAdding(false)
            toast.error('Please enter a valid name', { position: "bottom-right" })
            return
        }
        if (enteredAccount.trim().length === 0) {
            setIsAdding(false)
            toast.error('Please enter a valid account', { position: "bottom-right" })
            return
        }
        if (!enteredAccount.match(/^0x[a-fA-F0-9]{40}$/)) {
            setIsAdding(false)
            toast.error('Please enter a valid account', { position: "bottom-right" })
            return
        }
        console.log(account)
        if (enteredAccount.trim() === account) {
            setIsAdding(false)
            toast.error('Compromised account cannot be same as the connected account.', { position: "bottom-right" })
            return
        }

        // Add validation
        const result = await fetch('/api/compromised/add', {
            method: 'POST',
            body: JSON.stringify({
                account: enteredAccount,
                name: enteredName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!result.ok) {
            toast.error((await result.json()).message, { position: "bottom-right" })
            setIsAdding(false)
            return
        }
        const addedCompromised = (await result.json()).compromised;
        console.log("addedCompromised", addedCompromised)
        AccountStore.update((s) => {
            s.compromised = [...s.compromised, {
                _id: addedCompromised._id,
                name: addedCompromised.name,
                account: addedCompromised.account,
            }]
        })
        setIsAdding(false)
        router.replace('/')
    }

    return (
        <Auth>
            <BalanceBar />
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
                <div class="p-6  bg-white border-b ">
                    <div className='flex justify-end'>
                        <Link
                            href={'/'}
                            className=" self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            </div>
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
                <div class="p-6  bg-white border-b ">
                    {isLoading && <Loading />}
                    {!isLoading && (

                        <div>
                            <p>
                                <span className="text-red-600 text-xl font-bold">
                                    Add
                                </span>{' '}
                                <span className="font-bold text-xl">
                                    Compromised Account
                                </span>
                            </p>
                            <br />
                            <form onSubmit={submitHandler} autoComplete="off">
                                <div>
                                    <label
                                        className="block font-large font-semibold text-sm text-gray-700 text-right"
                                        htmlFor="model"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="model"
                                        className="text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Bob's Hacked account"
                                        ref={nameInputRef}
                                    />
                                </div>
                                <br />
                                <div>
                                    <label
                                        className="block font-large font-semibold text-sm text-gray-700 text-right"
                                        htmlFor="model"
                                    >
                                        Compromised Account
                                    </label>
                                    <input
                                        id="model"
                                        className="text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="text"
                                        placeholder="0x...."
                                        ref={accountInputRef}
                                    />
                                </div>

                                <br />
                                <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ">
                                    {isAdding && (
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
                                    {isAdding && 'Adding Compromised Account...'}
                                    {!isAdding && 'Add Compromised Account'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Auth>
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
