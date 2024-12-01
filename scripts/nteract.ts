import Web3 from "web3";

const alchemyUrl = `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;
const web3 = new Web3(alchemyUrl);

async function getBalance(address: string) {
  const balance = await web3.eth.getBalance(address);
  console.log(`Balance of ${address}:`, web3.utils.fromWei(balance, "ether"));
}

getBalance("0xYourAddressHere");
