import { ethers } from 'ethers';
import { Button, HelperText, Input } from '@windmill/react-ui';
import { useState } from 'react';
import { addressMap, tokenMap } from '../../config';
import { useTokenBalance } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';

const TokenInput = ({ token, allowanceRequiredFor, buttonText, buttonTextLoading, labelBottom, onOk, className, disabled = false }) => {
  const [amountText, setAmountText] = useState('');
  const [amount, setAmount] = useState(false);
  const [validAmount, setValidAmount] = useState(true);
  const { balance } = useTokenBalance(token);

  const tokenAddress = addressMap[token];
  const tokenInfo = tokenMap[tokenAddress];

  const onBeforeOk = () => {
    let amountBN;

    if (amount) {
      try {
        amountBN = ethers.utils.parseUnits(amount.toString(), tokenInfo.decimals);
      } catch (e) {
        throw new Error(`Error converting float number to bignumber, ${e.message}`);
      }
    }

    onOk(amount, amountBN, validAmount && amount);
  };

  const setValidatedAmount = (amount) => {
    if (amount > balance || amount < 0 || Number.isNaN(amount) || amount === 0) {
      setValidAmount(false);
    } else if (amount > 0) {
      setValidAmount(true);
      setAmount(amount);
    }
  };

  const onMaxAmount = () => {
    setAmountText(balance);
    setValidatedAmount(balance);
  };

  const onAmountChanged = e => {
    const text = e.target.value.trim();
    setAmountText(text);
    setValidAmount(true);

    if (text.trim() === '') {
      setAmount(false);
      return;
    }

    const potentialAmount = parseFloat(e.target.value);
    setValidatedAmount(potentialAmount);
  };

  const renderInput = () => {
    return <>
      <div className="bg-white flex border border-black">
        <div className="p-2">
          <Input
            disabled={disabled}
            type="number"
            value={amountText}
            placeholder='0.00'
            onChange={onAmountChanged}
            valid={validAmount}
            className="border-transparent text-xl border-b border-black"
          />
        </div>
        <div className="pr-3 text-sm self-end mb-3">{tokenInfo.friendlyName}</div>
      </div>
    </>;
  };

  const renderHelpers = () => {
    return <>
      <HelperText className={`${validAmount ? 'hidden' : ''} text-sm block`} valid={false}>The amount is not valid</HelperText>
      <HelperText className=" text-sm block">{labelBottom}</HelperText>
    </>;
  };

  const renderMaxButton = () => {
    return <div className="p-1 border border-black ml-1">
      <Button disabled={disabled} onClick={() => onMaxAmount()} className="bg-gray-400 h-full ring-pink-300 ring-inset focus:bg-gray-400">
        <span className="uppercase">max</span>
      </Button>
    </div>;
  };

  const renderTransactionButton = () => {
    return <TransactionButton
      className="flex"
      allowanceRequiredFor={allowanceRequiredFor}
      text={buttonText}
      textLoading={buttonTextLoading}
      secondaryLooks
      disabled={disabled}
      onClick={onBeforeOk}
    />;
  };

  return <div className={className}>
    <div className="flex">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex">
            {renderInput()}
            {renderMaxButton()}
            <div className="ml-1 hidden md:flex">
              {renderTransactionButton()}
            </div>
          </div>
        </div>
        {renderHelpers()}
      </div>
    </div>
    <div className="mt-4 md:hidden">
      {renderTransactionButton()}
    </div>
  </div >;
};

export default TokenInput;
