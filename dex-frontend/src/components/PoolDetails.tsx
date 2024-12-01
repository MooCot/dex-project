import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectWallet, getContract } from "../utils/ethereum";

const PoolDetails = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [liquidity, setLiquidity] = useState<{ token1: string; token2: string } | null>(null);

  const poolAddress = ""; // Адрес контракта пула ликвидности

  useEffect(() => {
    const fetchPoolDetails = async () => {
      const { accounts } = await connectWallet();
      setAccount(accounts[0]);

      const poolContract = getContract(poolAddress, liquidityPoolAbi);
      const liquidityDetails = await poolContract.getLiquidity();
      setLiquidity({
        token1: ethers.utils.formatUnits(liquidityDetails[0], 18),
        token2: ethers.utils.formatUnits(liquidityDetails[1], 18),
      });
    };

    fetchPoolDetails();
  }, []);

  return (
    <div>
      <button onClick={connect}>Подключить кошелек</button>
      {account && <p>Подключено: {account}</p>}
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