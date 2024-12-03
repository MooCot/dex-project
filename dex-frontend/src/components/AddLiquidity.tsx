import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";
import erc20Abi from "../abis/ERC20.json";
import wethAbi from "../abis/WETH9.json";
import uniswapV2RouterAbi from "../abis/UniswapV2Router02.json";
import uniswapV2FactoryAbi from "../abis/UniswapV2Factory.json";

interface AddLiquidityProps {
  token1Address: string;
  token2Address: string;
  uniswapV2RouterAddress: string;
  uniswapV2FactoryAddress: string;
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ token1Address, token2Address, uniswapV2RouterAddress, uniswapV2FactoryAddress }) => {
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

    const token1Contract = getContract(token1Address, erc20Abi);
    const token2Contract = getContract(token2Address, wethAbi);
    const uniswapV2RouterContract = getContract(uniswapV2RouterAddress, uniswapV2RouterAbi);
    const uniswapV2FactoryContract = getContract(uniswapV2FactoryAddress, uniswapV2FactoryAbi);

    if (typeof window.ethereum === "undefined") {
      alert("Пожалуйста, установите Metamask!");
      throw new Error("Ethereum провайдер не найден.");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum!);
    const signer = provider.getSigner();
    const token1WithSigner = token1Contract.connect(signer);
    const token2WithSigner = token2Contract.connect(signer);
    const uniswapV2RouterWithSigner = uniswapV2RouterContract.connect(signer);

    // Проверяем баланс пользователя и approve токенов для контракта пула ликвидности
    await token1WithSigner.approve(uniswapV2RouterAddress, ethers.utils.parseUnits(amountToken1.toString(), 18));
    await token2WithSigner.approve(uniswapV2RouterAddress, ethers.utils.parseUnits(amountToken2.toString(), 18));


    await uniswapV2RouterWithSigner.addLiquidity(
      token1Address,
      token2Address,
      ethers.utils.parseUnits(amountToken1.toString(), 18),
      ethers.utils.parseUnits(amountToken2.toString(), 18),
      0,  // Мин. количество токенов для добавления (можно оставить 0)
      0,  // Мин. количество второго токена
      account,
      Math.floor(Date.now() / 1000) + 60 * 20, // Время завершения (через 20 минут)
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
