import React, { useState, useEffect } from 'react'
import { useStoreState } from 'pullstate'
import { useWeb3React } from '@web3-react/core'
import * as C from './AskAmountPill.styled'

import ContractStore from '../../stores/ContractStore'
import Dropdown from './Dropdown'
import DownCaret from './DownCaret'
import {
  formatCurrency,
  formatCurrencyMinMaxDecimals,
  truncateDecimals,
  checkValidInputForCoin,
  removeCommas,
} from '../../utils/math'
import { assetRootPath } from '../../utils/image'

const CoinImage = ({ small, coin, isSemiTransparent = false }) => {
  const className = `coin-image ${isSemiTransparent ? 'transparent' : ''}`
  return (
    <div className="d-flex align-items-center">
      {coin !== 'mix' && (
        <img
          className={`${className} ${small ? 'small' : ''}`}
          src={assetRootPath(`/images/currency/${coin}-icon-small.svg`)}
        />
      )}
      {coin === 'mix' && (
        <div className="d-flex align-items-start">
          <img
            className={`${className} mixed coin-1 ${small ? 'small' : ''}`}
            src={assetRootPath(`/images/currency/dai-icon-small.svg`)}
          />
          <img
            className={`${className} mixed coin-2 ${small ? 'small' : ''}`}
            src={assetRootPath(`/images/currency/usdt-icon-small.svg`)}
          />
          <img
            className={`${className} mixed coin-3 ${small ? 'small' : ''}`}
            src={assetRootPath(`/images/currency/usdc-icon-small.svg`)}
          />
        </div>
      )}
      <style jsx>{`
        .coin-image {
          width: 26px;
          height: 26px;
        }

        .coin-image.transparent {
          opacity: 0.3;
        }

        .coin-image.small {
          width: 14px;
          height: 14px;
        }

        .mixed {
          position: relative;
        }

        .coin-1 {
          z-index: 1;
        }

        .coin-2 {
          z-index: 2;
          margin-left: -9px;
        }

        .coin-3 {
          z-index: 3;
          margin-left: -9px;
        }
      `}</style>
    </div>
  )
}

const CoinSelect = ({ selected, onChange, options = [] }) => {
  const [open, setOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState(selected)

  return (
    <>
      <button onClick={() => { setOpen(!open) }} id="dropdownDefaulta" data-dropdown-toggle="dropdowna" className="w-full mr-5 justify-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button">{selected.toUpperCase()}<svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
      <div id="dropdowna" className={`z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow ${open ? "block" : "hidden"
        }`}>
        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaulta">
          {options.map((option) => {
            return (

              <li key={option} onClick={(e) => {
                onChange(option)
                setOpen(false)
              }}>
                <a href="#" className="text-center  block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"> {option.toUpperCase()}</a>
              </li>


            )
          })}
        </ul>
      </div>
    </>
  )
}
/*
 * selectedCoin - the coin or coin combination to be shown - selected
 * balances - Array of balances to be shown. UI differs when there is only 1 item vs many in the array
 */
const AskAmountPill = ({
  identifier,
  onSelectChange,
  coinBalances,
  onAmountChange,
  selectedCoin,
  selectableCoins,
  selectedSwap,
  swapsLoading,
  priceToleranceValue,
  swapMode,
  activeTab,
  onErrorChange,
  coinValue,
  ratioFactor,
  pos,
}) => {
  console.log(
    'SwapCurrencyPill',
    identifier,
    selectedCoin,
    selectableCoins,
    coinValue
  )
  console.log('🤯 SwapCurrencyPill : coinBalances', coinBalances)
  console.log('⚡⚡⚡ -->', ratioFactor, identifier, activeTab)
  const [error, setError] = useState(null)
  const { active } = useWeb3React()
  const coins = useStoreState(ContractStore, (s) => s.coins)

  const floorTo2to6Decimals = (value) => {
    return formatCurrencyMinMaxDecimals(value, {
      minDecimals: 2,
      maxDecimals: 18,
      truncate: true,
    })
  }

  // TODO: Getting Display Balance
  const getDisplayBalance = () => {
    const roundTo2Decimals = (value) => {
      return formatCurrency(parseFloat(value), 6)
    }
    if (selectedCoin === undefined || Object.keys(coinBalances).length === 0) {
      return
    }
    return {
      coin: selectedCoin.toLowerCase(),
      balance: roundTo2Decimals(
        coinBalances[selectedCoin.toLowerCase()]['balance']
      ),
      detailedBalance: coinBalances[selectedCoin.toLowerCase()]['balance'] || 0,
    }
  }

  useEffect(() => {
    if (onErrorChange) {
      onErrorChange(identifier, error)
    }
  }, [error])

  useEffect(() => {
    checkForBalanceError()
  }, [coinValue, selectedCoin])

  const displayBalance = getDisplayBalance()

  useEffect(() => {
    /* User has manually inputted the amount that matches the wallet's balance up to 6th decimal.
     * Add the dust (decimals beyond the 6th one) to the input amount so it is not left behind
     * in the wallet.
     */
    if (
      displayBalance &&
      coinValue &&
      floorTo2to6Decimals(displayBalance.detailedBalance) ===
      floorTo2to6Decimals(coinValue) &&
      removeCommas(displayBalance.detailedBalance) !==
      removeCommas(coinValue) &&
      // this bit is required so that zeroes can be added to input when already at max value
      parseFloat(displayBalance.detailedBalance) !== parseFloat(coinValue)
    ) {
      setMaxBalance()
    }
  }, [coinValue, displayBalance])

  const checkForBalanceError = () => {
    const coin = selectedCoin
    console.log(
      '🤯 SwapCurrencyPill : checkForBalanceError : coin',
      coin,
      coinBalances
    )
    if (Object.keys(coinBalances).length > 0 && coin) {
      if (parseFloat(coinValue) === 0) {
        setError(true)
        return
      }
      console.log(
        '🤯 SwapCurrencyPill : checkForBalanceError Setting error ',
        parseFloat(coinBalances[coin.toLowerCase()].balance) <
        parseFloat(coinValue)
      )
      setError(
        parseFloat(coinBalances[coin.toLowerCase()].balance) <
        parseFloat(coinValue)
      )
    }
  }

  const expectedAmount =
    selectedSwap &&
    selectedSwap.amountReceived &&
    formatCurrency(selectedSwap.amountReceived, 2)

  const minReceived =
    selectedSwap && selectedSwap.amountReceived && priceToleranceValue
      ? selectedSwap.amountReceived -
      (selectedSwap.amountReceived * priceToleranceValue) / 100
      : null

  const maxBalanceSet =
    displayBalance &&
    // if balance and input match up to 6th decimal. Consider it effectively as set to max balance
    floorTo2to6Decimals(displayBalance.detailedBalance) ===
    floorTo2to6Decimals(coinValue)

  const balanceClickable =
    displayBalance && !maxBalanceSet && parseFloat(displayBalance.balance) > 0

  const setMaxBalance = () => {
    if (!displayBalance) {
      return
    }

    const valueNoCommas = removeCommas(displayBalance.detailedBalance)
    onAmountChange(identifier, valueNoCommas)
  }

  const coinNameToDecimals = (coinName) => {
    return 18;
  }

  return (
    <>
      <div className="flex flex-row">
        <div className="basis-1/4">
          <div className='flex'>
            <div className='flex-1 pr-2 text-end'>
              <C.CoinSelectDiv>
                <CoinSelect
                  selected={selectedCoin.toLowerCase()}
                  onChange={(coin) => {
                    onSelectChange(identifier, coin)
                  }}
                  options={selectableCoins}
                />
              </C.CoinSelectDiv>
            </div>
          </div>


        </div>
        <div className="basis-3/4">
          <div className="relative z-0">
            <input type="text" id="floating_tandard" className="text-right block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={truncateDecimals(
              coinValue,
              coinNameToDecimals(selectedCoin)
            )} onChange={(e) => {
              if (Object.keys(coinBalances).length == 0) {
                return
              }
              // truncate decimals after 6th position
              console.log('identifier', identifier)

              const value = truncateDecimals(
                e.target.value,
                coinNameToDecimals(selectedCoin)
              )
              // onAmountChange(identifier, value)
              const valueNoCommas = removeCommas(value)
              if (
                checkValidInputForCoin(
                  valueNoCommas,
                  selectedCoin,
                  coinBalances[selectedCoin.toLowerCase()]['decimals']
                )
              ) {
                onAmountChange(identifier, valueNoCommas, ratioFactor)
              }
            }} />
            <label for="floating_standard" className="right-0 absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:right-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Deposit ETH</label>
            <p id="floating_helper_text" class="mt-2 text-right text-xs text-gray-500 dark:text-gray-400"> {displayBalance && (
              <span>
                {displayBalance.balance}
                <C.CoinNameSpan className="text-uppercase ml-1">
                  {displayBalance.coin}
                </C.CoinNameSpan>
              </span>
            )} <button onClick={setMaxBalance} type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-2 py-1 text-center mr-2 mb-2">MAX</button></p>
          </div>
        </div>
      </div>
      {/* <C.Container pos={pos}>
        <C.InnerContainer>
          <C.CoinSelectDiv>
            <CoinSelect
              selected={selectedCoin.toLowerCase()}
              onChange={(coin) => {
                onSelectChange(identifier, coin)
              }}
              options={selectableCoins}
            />
          </C.CoinSelectDiv>
          <C.FlexDiv>
            <C.InputContainer>
              {
                <C.Input
                  type="text"
                  value={truncateDecimals(
                    coinValue,
                    coinNameToDecimals(selectedCoin)
                  )}
                  placeholder="0.00"
                  onChange={(e) => {
                    if (Object.keys(coinBalances).length == 0) {
                      return
                    }
                    // truncate decimals after 6th position
                    console.log('identifier', identifier)

                    const value = truncateDecimals(
                      e.target.value,
                      coinNameToDecimals(selectedCoin)
                    )
                    // onAmountChange(identifier, value)
                    const valueNoCommas = removeCommas(value)
                    if (
                      checkValidInputForCoin(
                        valueNoCommas,
                        selectedCoin,
                        coinBalances[selectedCoin.toLowerCase()]['decimals']
                      )
                    ) {
                      onAmountChange(identifier, valueNoCommas, ratioFactor)
                    }
                  }}
                />
              }

              {
                <C.ExpectedValueDiv>
                  {expectedAmount ||
                    (swapsLoading ? fbt('Loading...', 'Swaps Loading...') : '')}
                </C.ExpectedValueDiv>
              }
              {
                <C.BalanceDiv>
                  {minReceived !== null
                    ? fbt(
                      'Min. received: ' +
                      fbt.param(
                        'cash-amount',
                        formatCurrency(minReceived, 2)
                      ) +
                      ' CASH',
                      'Min CASH amount received'
                    )
                    : ''}
                </C.BalanceDiv>
              }
            </C.InputContainer>
            <C.BalanceDiv>
              {
                <C.MaxButton onClick={setMaxBalance}>
                  Max
                </C.MaxButton>
              }
              {displayBalance && (
                <div>
                  {displayBalance.balance}
                  <C.CoinNameSpan className="text-uppercase ml-1">
                    {displayBalance.coin}
                  </C.CoinNameSpan>
                </div>
              )}
            </C.BalanceDiv>
          </C.FlexDiv>
        </C.InnerContainer>
      </C.Container> */}
    </>
  )
}
export default AskAmountPill
