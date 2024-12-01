import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";

const SwapTokens = () => {
  const [amountToken, setAmountToken] = useState<number>(0);
  const [account, setAccount] = useState<string | null>(null);

  // Подключение кошелька
  const connect = async () => {
    const { accounts, signer } = await connectWallet();
    setAccount(accounts[0]);
  };

  // Функция для обмена токенов
  const swap = async () => {
    if (!account) {
      alert("Пожалуйста, подключите кошелек!");
      return;
    }

    const token1Address = "0x..."; // Адрес токена
    const token2Address = "0x..."; // Адрес токена
    const dexAddress = "0x..."; // Адрес контракта DEX

    const token1Contract = getContract(token1Address, erc20Abi);
    const token2Contract = getContract(token2Address, erc20Abi);
    const dexContract = getContract(dexAddress, dexAbi);

    const signer = provider.getSigner();
    const token1WithSigner = token1Contract.connect(signer);
    const token2WithSigner = token2Contract.connect(signer);
    const dexWithSigner = dexContract.connect(signer);

    await token1WithSigner.approve(dexAddress, ethers.utils.parseUnits(amountToken.toString(), 18));

    await dexWithSigner.swapTokens(
      ethers.utils.parseUnits(amountToken.toString(), 18),
      { gasLimit: 1000000 }
    );

    alert("Обмен успешно выполнен!");
  };

  return (
    <div>
      <button onClick={connect}>Подключить кошелек</button>
      {account && <p>Подключено: {account}</p>}
      <input
        type="number"
        value={amountToken}
        onChange={(e) => setAmountToken(Number(e.target.value))}
        placeholder="Количество токенов"
      />
      <button onClick={swap}>Обменять токены</button>
    </div>
  );
};

export default SwapTokens;