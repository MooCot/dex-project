import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Factory
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address); // Укажите адрес владельца
  await factory.deployed();
  console.log("UniswapV2Factory deployed at:", factory.address);

  // Deploy WETH
  const WETH = await ethers.getContractFactory("WETH9");
  const weth = await WETH.deploy();
  await weth.deployed();
  console.log("WETH deployed at:", weth.address);

  // Deploy Router
  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, weth.address);
  await router.deployed();
  console.log("UniswapV2Router02 deployed at:", router.address);

  // Deploy ERC20 Token (MyToken)
  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy(ethers.utils.parseUnits("1000000", 18)); // 1,000,000 токенов
  await token.deployed();
  console.log("MyToken deployed at:", token.address);

    // Создаем пару токенов (MyToken/WETH)
    const pairTx = await factory.createPair(token.address, weth.address);
    await pairTx.wait();
    const pairAddress = await factory.getPair(token.address, weth.address);
    console.log("Token/WETH Pair created at:", pairAddress);

    const filePath = path.resolve(__dirname, "../artifacts/contracts/v5/UniswapV2Pair.sol/UniswapV2Pair.json");
    const pairABI = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    ).abi;
  
  // Сохраняем ABI и адреса контрактов в JSON файлы
  const contracts = {
    WETH: {
      address: weth.address,
      abi: WETH.interface.format(ethers.utils.FormatTypes.json)
    },
    ERC20: {
      address: token.address,
      abi: Token.interface.format(ethers.utils.FormatTypes.json)
    },
    UniswapV2Factory: {
      address: factory.address,
      abi: Factory.interface.format(ethers.utils.FormatTypes.json)
    },
    UniswapV2Router02: {
      address: router.address,
      abi: Router.interface.format(ethers.utils.FormatTypes.json)
    },
    UniswapV2Pair: {
      address: pairAddress,
      abi: pairABI,
    },
  };

  // Записываем в файлы
  fs.writeFileSync('./dex-frontend/src/abis/WETH.json', JSON.stringify(contracts.WETH, null, 2));
  fs.writeFileSync('./dex-frontend/src/abis/ERC20.json', JSON.stringify(contracts.ERC20, null, 2));
  fs.writeFileSync('./dex-frontend/src/abis/UniswapV2Factory.json', JSON.stringify(contracts.UniswapV2Factory, null, 2));
  fs.writeFileSync('./dex-frontend/src/abis/UniswapV2Router02.json', JSON.stringify(contracts.UniswapV2Router02, null, 2));
  fs.writeFileSync("./dex-frontend/src/abis/UniswapV2Pair.json", JSON.stringify(contracts.UniswapV2Pair, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});