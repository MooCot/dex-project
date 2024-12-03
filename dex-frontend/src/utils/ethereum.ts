import { ethers } from "ethers";

// Подключаем провайдер (например, MetaMask)
export const provider = new ethers.providers.Web3Provider(window.ethereum!);

// Функция для подключения кошелька
export const connectWallet = async () => {
  const accounts = await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return { accounts, signer };
};

// Получение контракта
export const getContract = (address: string, abi: any) => {
  return new ethers.Contract(address, abi, provider);
};