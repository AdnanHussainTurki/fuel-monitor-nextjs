import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { useRouter } from "next/router"
import { useStoreState } from "pullstate"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AccountStore from "../../stores/AccountStore"
import ContractStore from "../../stores/ContractStore"
import { displayCurrencyWithDecimalsNonWaiting, expandToDecimals } from "../../utils/math"
import withIsMobile from "../Layout/NavBar/withIsMobile"
import withWalletSelectModal from "../Layout/NavBar/withWalletSelectModal"
import AskAmountPill from "../Pills/AskAmountPill"

const FillWaterInContract = ({ showLogin, connect }) => {
    const { active, account, activate, library } = useWeb3React()
    const router = useRouter()
    useEffect(() => {
        if (!active) {
            router.push('/', undefined, { shallow: true })
            return;
        }
    }, [active])



    const balances = useStoreState(AccountStore, (s) => s.balances);
    const water = useStoreState(AccountStore, (s) => s.water);
    const contracts = useStoreState(ContractStore, (s) => s.contracts)
    const refetchUserData = useStoreState(AccountStore, (s) => s.refetchUserData)
    const [ethBalance, setEthBalance] = useState(0)
    const [balanceLoaded, setBalanceLoaded] = useState(false)
    const [myETHBalance, setMyETHBalance] = useState(0)
    const [selectedInput1, setSelectedInput1] = useState('eth')
    const [selectableInput1, setSelectableInput1] = useState(['eth'])
    const [amountInput1, setAmountInput1] = useState('')
    const [expandedAmountInput1, setExpandedAmountInput1] = useState(0)
    const [waterLoaded, setWaterLoaded] = useState(false)
    const [waterBalance, setWaterBalance] = useState(0)
    const [ethSymbol, setEthSymbol] = useState("ETH")
    useEffect(() => {
        if (active && !balanceLoaded) {
            console.log('balances', balances)
            if (balances['eth']) {
                setEthBalance(balances['eth'].display)
                setEthSymbol(balances['eth'].name)
                setBalanceLoaded(true)
            }
        }
    }, [active, balances, balanceLoaded])
    useEffect(() => {
        setWaterBalance(water)
        setWaterLoaded(true)
    }, [water])
    useEffect(() => {
        if (balances['eth']) {
            setMyETHBalance(balances['eth'].raw)
        }
    }, [balances])
    useEffect(() => {
        if (amountInput1) {
            setExpandedAmountInput1(expandToDecimals(amountInput1, 18).toString())
        }
    }, [amountInput1]);
    const setRefreshState = () => {
        AccountStore.update((s) => {
            s.refetchUserData = true;
        })
    }

    const onFillWater = async () => {
        if (expandedAmountInput1) {
            try {
                const fireFighter = contracts['FireFighter'];
                const connSigner = (contract) => {
                    return contract.connect(library.getSigner(account))
                }
                const tx = await connSigner(fireFighter).fillWater({
                    value: expandedAmountInput1
                })
                await tx.wait()
                toast.success("Great! Water filled in Firetruck 🚒", { position: "bottom-right" })
                setAmountInput1('')

                setRefreshState()
                console.log("refetchUserData", refetchUserData)
            } catch (error) {
                console.error(error)
                toast.error(errorMap(error.message), { position: "bottom-right" })
            }
        }
    }
    const errorMap = (err) => {
        if (err.includes("insufficient funds")) {
            return "Umm.. Insufficient funds"
        } else if (err.includes("rejected")) {
            return "Oops.. Seems like you rejected the transaction 🫤"
        } else if (err.includes("nonce")) {
            return "Oops.. There seems to be some issue with the nonce. You may try to reset the Metamask account and try again."
        }
        return err;
    }

    return (
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
            <div class="p-6 bg-white border-b ">
                <AskAmountPill
                    identifier="input1"
                    coinBalances={balances}
                    selectedCoin={selectedInput1} // Coin that would be shown on the pill as selected | May not present in the dropdown
                    selectableCoins={selectableInput1} // Coins that would be shown in the dropdown
                    onAmountChange={async (identifier, amount, ratioFactor) => {
                        console.log(
                            'Pill',
                            identifier,
                            ' trying to change to amount value to ',
                            amount
                        )
                        setAmountInput1(amount)
                    }}
                    coinValue={amountInput1} // Value of the coin to be shown on the pill
                    onSelectChange={async (identifier, coin) => {
                        // This will be invoked when the some other coin is selected from the dropdown
                        console.log(
                            'Pill',
                            identifier,
                            ' trying to change to ',
                            coin
                        )
                    }}
                    onErrorChange={async (identifier, err) => {
                        console.log('Pill', identifier, ' is throwing error: ', err)
                    }}
                />
                <br />
                {waterLoaded ?
                    (<h4>Water in your 🚒 Firetruck: {displayCurrencyWithDecimalsNonWaiting(waterBalance, 18)} {ethSymbol}</h4>)
                    :
                    (<p>Loading water in your 🚒 Firetruck...</p>)

                }
                <br />

                {((BigNumber.from(expandedAmountInput1)).gt(BigNumber.from(myETHBalance))) &&
                    (<div>
                        <div className="flex p-4 mb-4 text-sm text-rose-800 bg-rose-200 rounded-lg dark:bg-rose-200 dark:text-yellow-800" role="alert">
                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Info</span>
                            <div>
                                <span className="font-medium">Insufficient Balance!</span> You have {displayCurrencyWithDecimalsNonWaiting(myETHBalance, 18)} ETH in your wallet while you are trying to add {displayCurrencyWithDecimalsNonWaiting(expandedAmountInput1, 18)} ETH. Please deposit more ETH to fill water in your 🚒 Firetruck.
                            </div>
                        </div>
                        <br />
                    </div>
                    )}
                {((BigNumber.from(expandedAmountInput1)).lte(BigNumber.from(myETHBalance))) &&
                    (<button
                        onClick={onFillWater}
                        type="button"
                        className="text-white  bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                        Fill Water
                    </button>
                    )}

            </div>
        </div>)
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

export default withIsMobile(withWalletSelectModal(FillWaterInContract))
