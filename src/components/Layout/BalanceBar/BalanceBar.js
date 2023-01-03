import { useWeb3React } from "@web3-react/core"
import { useStoreState } from "pullstate"
import { useEffect, useState } from "react"
import AccountStore from "../../../stores/AccountStore"
import { walletLogin } from "../../../utils/account"
import { displayCurrencyWithDecimalsNonWaiting } from "../../../utils/math"
import ConnectWithMetamask from "../../Button/ConnectWithMetamask"
import withIsMobile from "../NavBar/withIsMobile"
import withWalletSelectModal from "../NavBar/withWalletSelectModal"

const BalancerBar = ({ showLogin, connect })  => {
    const { active, account, activate } = useWeb3React()
    const balances = useStoreState(AccountStore, (s) => s.balances);
    const water = useStoreState(AccountStore, (s) => s.water);

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (balances["eth"] != undefined && water) {
            setIsLoading(false)
        } 
    }, [water, balances])
    return (
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
            <div class="p-6 bg-white border-b ">
                <div class="flex flex-row">
                    <div class="basis-1/2">
                        {active && !isLoading && (
                            <span>
                                <span className="font-bold">Account:</span>
                                <br />{' '}
                                <span className="text-red-600">
                                    {account}
                                </span>
                            </span>
                        )}
                    </div>
                    <div class="basis-1/2 align-middle text-center ">
                        {!active && (
                            <ConnectWithMetamask walletLogin={walletLogin} showLogin={showLogin} activate={activate} />
                        )}
                        {active && !isLoading && (
                            <span>
                                <span className="font-bold">
                                    ETH Balance:
                                </span>
                                <br />{' '}
                                <span className="text-red-600">
                                    {balances["eth"].display} {balances["eth"].name}
                                </span>
                            </span>
                        )}
                        <br />
                        {active && !isLoading && (
                            <span>
                                <span className="font-bold">
                                    Water in FireTruck:
                                </span>
                                <br />{' '}
                                <span className="text-red-600">
                                    { displayCurrencyWithDecimalsNonWaiting(water, 18) } {balances["eth"].name}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>)
}

export default withIsMobile(withWalletSelectModal(BalancerBar))
