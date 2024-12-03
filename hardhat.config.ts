import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.5.16", // Для контрактов с версией 0.5.16
        settings: {
          optimizer: {
            enabled: true, // Включаем оптимизацию
            runs: 200,     // Количество прогонов (настраивайте по нужде)
          },
        },
      },
      {
        version: "0.6.6", // Для контрактов с версией 0.6.6
        settings: {
          optimizer: {
            enabled: true, // Включаем оптимизацию
            runs: 200,     // Количество прогонов (настраивайте по нужде)
          },
        },
      },
    ],
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;