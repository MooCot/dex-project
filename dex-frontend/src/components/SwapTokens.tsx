import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";
import wethAbi from "../abis/WETH9.json";
import uniswapV2Router02Abi from "../abis/UniswapV2Router02.json"; // ABI для UniswapV2Router02

interface SwapTokensProps {
  token1Address: string;
  token2Address: string;
  uniswapV2Router02Address: string;
}

const SwapTokens: React.FC<SwapTokensProps> = ({ token1Address, token2Address, uniswapV2Router02Address }) => {
  const [amountToken, setAmountToken] = useState<number>(0);
  const [account, setAccount] = useState<string | null>(null);

  // Подключение кошелька
  const connect = async () => {
    const { accounts } = await connectWallet();
    setAccount(accounts[0]);
  };

  // Функция для обмена токенов
  const swap = async () => {
    if (!account) {
      alert("Пожалуйста, подключите кошелек!");
      return;
    }

    const token1Contract = getContract(token1Address, wethAbi);
    const uniswapV2Router02Contract = getContract(uniswapV2Router02Address, uniswapV2Router02Abi);

    if (typeof window.ethereum === "undefined") {
      alert("Пожалуйста, установите Metamask!");
      throw new Error("Ethereum провайдер не найден.");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum!);
    const signer = provider.getSigner();
    const token1WithSigner = token1Contract.connect(signer);
    const uniswapV2Router02WithSigner = uniswapV2Router02Contract.connect(signer);

    // Даем разрешение Uniswap на использование токенов
    await token1WithSigner.approve(uniswapV2Router02Address, ethers.utils.parseUnits(amountToken.toString(), 18));

    // Вызов метода обмена токенов
    await uniswapV2Router02WithSigner.swapExactTokensForTokens(
      ethers.utils.parseUnits(amountToken.toString(), 18), // Сумма токенов для обмена
      0, // Минимальное количество токенов, которое мы получим (можно использовать slippage)
      [token1Address, token2Address], // Массив адресов токенов, от и до
      account, // Адрес получателя
      Math.floor(Date.now() / 1000) + 60 * 10, // Время истечения транзакции (например, 10 минут)
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