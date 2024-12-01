import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";

const AddLiquidity = () => {
  const [amountToken1, setAmountToken1] = useState<number>(0);
  const [amountToken2, setAmountToken2] = useState<number>(0);
  const [account, setAccount] = useState<string | null>(null);

  // Подключение кошелька
  const connect = async () => {
    const { accounts, signer } = await connectWallet();
    setAccount(accounts[0]);
  };

  // Функция для добавления ликвидности в пул
  const addLiquidity = async () => {
    if (!account) {
      alert("Пожалуйста, подключите кошелек!");
      return;
    }

    const token1Address = ""; // Адрес первого токена
    const token2Address = ""; // Адрес второго токена
    const liquidityPoolAddress = ""; // Адрес контракта пула ликвидности

    const token1Contract = getContract(token1Address, erc20Abi);
    const token2Contract = getContract(token2Address, erc20Abi);
    const liquidityPoolContract = getContract(liquidityPoolAddress, liquidityPoolAbi);

    const signer = provider.getSigner();
    const token1WithSigner = token1Contract.connect(signer);
    const token2WithSigner = token2Contract.connect(signer);
    const liquidityPoolWithSigner = liquidityPoolContract.connect(signer);

    // Проверяем баланс пользователя и approve токенов для контракта пула ликвидности
    await token1WithSigner.approve(liquidityPoolAddress, ethers.utils.parseUnits(amountToken1.toString(), 18));
    await token2WithSigner.approve(liquidityPoolAddress, ethers.utils.parseUnits(amountToken2.toString(), 18));

    // Добавляем ликвидность
    await liquidityPoolWithSigner.addLiquidity(
      ethers.utils.parseUnits(amountToken1.toString(), 18),
      ethers.utils.parseUnits(amountToken2.toString(), 18),
      { gasLimit: 1000000 }
    );

    alert("Ликвидность успешно добавлена!");
  };

  return (
    <div>
      <button onClick={connect}>Подключить кошелек</button>
      {account && <p>Подключено: {account}</p>}
      <input
        type="number"
        value={amountToken1}
        onChange={(e) => setAmountToken1(Number(e.target.value))}
        placeholder="Количество токенов 1"
      />
      <input
        type="number"
        value={amountToken2}
        onChange={(e) => setAmountToken2(Number(e.target.value))}
        placeholder="Количество токенов 2"
      />
      <button onClick={addLiquidity}>Добавить ликвидность</button>
    </div>
  );
};

export default AddLiquidity;