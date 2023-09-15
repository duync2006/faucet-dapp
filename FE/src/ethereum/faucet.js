import { ethers } from "ethers";
import faucetAbi from "../contracts/faucet.json"
import contractAddress from "../contracts/contract-address.json"
const faucetContract = async(provider) => {
  return new ethers.Contract(
    contractAddress.Token,
    faucetAbi.abi,
    provider
  );
};

export default faucetContract;
