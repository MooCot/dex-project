import React from 'react';
import AddLiquidity from './components/AddLiquidity';
import SwapTokens from './components/SwapTokens';
import PoolDetails from './components/PoolDetails';

const App = () => {
  return (
    <div>
      <h1>DEX Interface</h1>
      <AddLiquidity />
      <SwapTokens />
      <PoolDetails />
    </div>
  );
};

export default App;