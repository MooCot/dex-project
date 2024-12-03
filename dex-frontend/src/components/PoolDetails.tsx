import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";
import liquidityPoolAbi from "../abis/UniswapV2Pair.json";
import uniswapV2FactoryAbi from "../abis/UniswapV2Factory.json"; // ABI для UniswapV2Factory

interface PoolDetailsProps {
  token1Address: string;
  token2Address: string;
  uniswapV2FactoryAddress: string;
}

const PoolDetails: React.FC<PoolDetailsProps> = ({
  token1Address,
  token2Address,
  uniswapV2FactoryAddress
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [liquidity, setLiquidity] = useState<{ token1: string; token2: string } | null>(null);
  const [poolAddress, setPoolAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      const { accounts } = await connectWallet();
      setAccount(accounts[0]);

      const provider = new ethers.providers.Web3Provider(window.ethereum!);
      const signer = provider.getSigner();

      // Получаем контракт для UniswapV2Factory
      const uniswapV2FactoryContract = getContract(uniswapV2FactoryAddress, uniswapV2FactoryAbi);
      
      // Получаем адрес пула для данной пары токенов
      const pairAddress = await uniswapV2FactoryContract.getPair(token1Address, token2Address);
      if (pairAddress === ethers.constants.AddressZero) {
        alert("Пул ликвидности для этой пары токенов не существует.");
        return;
      }

      setPoolAddress(pairAddress);

      // Получаем данные о ликвидности из контракта пула
      const poolContract = getContract(pairAddress, liquidityPoolAbi);
      const liquidityDetails = await poolContract.getLiquidity();
      setLiquidity({
        token1: ethers.utils.formatUnits(liquidityDetails[0], 18),
        token2: ethers.utils.formatUnits(liquidityDetails[1], 18),
      });
    };

    fetchPoolDetails();
  }, [token1Address, token2Address, uniswapV2FactoryAddress]);

  return (
    <div>
      <button onClick={connectWallet}>Подключить кошелек</button>
      {account && <p>Подключено: {account}</p>}
      {poolAddress && <p>Адрес пула ликвидности: {poolAddress}</p>}
      {liquidity && (
        <div>
          <p>Токен 1 в пуле: {liquidity.token1}</p>
          <p>Токен 2 в пуле: {liquidity.token2}</p>
        </div>
      )}
    </div>
  );
};

export default PoolDetails;
