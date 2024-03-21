import { getSession } from 'next-auth/react'
import { useRef } from 'react'
import Auth from '../../src/components/Templates/Auth/Auth'

export default function view() {
    const newPasswordInputRef = useRef()
    const oldPasswordInputRef = useRef()
    const submitHandler = async (event) => {
        event.preventDefault()
        const enteredNewPassword = newPasswordInputRef.current.value
        const enteredOldPassword = oldPasswordInputRef.current.value
        // Add validation
        const result = await fetch('/api/user/change-password', {
            method: 'PATCH',
            body: JSON.stringify({
                oldPassword: enteredOldPassword,
                newPassword: enteredNewPassword,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    return (
        <Auth>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b ">
                    <form onSubmit={submitHandler}>
                        <div>
                            <label
                                className="block font-large text-sm text-gray-700 "
                                htmlFor="oldPassword"
                            >
                                Current Password
                            </label>
                            <input
                                id="oldPassword"
                                className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                required="required"
                                type="password"
                                placeholder="Current Password"
                                ref={oldPasswordInputRef}
                            />
                        </div>
                        <br />
                        <div>
                            <label
                                className="block font-large text-sm text-gray-700 "
                                htmlFor="newPassword"
                            >
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                required="required"
                                type="password"
                                placeholder="New Password"
                                ref={newPasswordInputRef}
                            />
                        </div>
                        <br />
                        <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ">
                            Change Password
                        </button>
                    </form>
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
                destination: '/auth/forgot',
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}
