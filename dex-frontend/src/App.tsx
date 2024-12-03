import React from 'react';
import AddLiquidity from './components/AddLiquidity';
import SwapTokens from './components/SwapTokens';
import PoolDetails from './components/PoolDetails';

const contractConfig = {
  token1Address: process.env.REACT_APP_TOKEN1_ADDRESS!,
  token2Address: process.env.REACT_APP_TOKEN2_ADDRESS!,
  uniswapV2FactoryAddress: process.env.REACT_APP_UNISWAP_V2_FACTORY_ADDRESS!,
  uniswapV2RouterAddress: process.env.REACT_APP_UNISWAP_V2_ROUTER_ADDRESS!,
};

const App = () => {
  return (
    <div>
      <h1>DEX Interface</h1>
      <AddLiquidity {...contractConfig} />
      <SwapTokens 
        token1Address={contractConfig.token1Address}
        token2Address={contractConfig.token2Address}
        uniswapV2Router02Address={contractConfig.uniswapV2RouterAddress}
      />
      <PoolDetails {...contractConfig} />
    </div>
  );
};

export default App;