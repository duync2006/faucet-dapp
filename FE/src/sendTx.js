import createLock from "./simpleLock"
import contractAddress from "./contracts/contract-address.json"
import faucet from "./contracts/faucet.json";
import Web3 from 'web3';

// config web3 instance
let ABI = faucet.abi;
const OWNER_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";
const JsonRpcURL = "https://vibi-seed.vbchain.vn/" 
const web3 = new Web3(JsonRpcURL)
const contract = new web3.eth.Contract(ABI, contractAddress.Token)


let nonce = 0;

const lock = createLock("send")

export const faucetByDay = async (walletAddress) => {
  // setWithdrawError("");
  // setWithdrawSuccess("");
  console.log(walletAddress)
  try {
    await lock.acquire()

    const estimatedGasLimit = await contract.methods.requestTokensByDay(walletAddress).estimateGas();
    let data = contract.methods.requestTokensByDay(walletAddress).encodeABI();
    console.log(data)
    const _nonce = await web3.eth.getTransactionCount("0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74", 'pending').catch(console.log)
    nonce = nonce > _nonce ? nonce : _nonce;
    console.log("nonce:", _nonce)
    let tx = {
      nonce: nonce,
      to: contractAddress.Token,
      from: "0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74",
      gasPrice:  await contract.methods.requestTokensByDay(walletAddress).estimateGas(),
      gasLimit: (await web3.eth.getBlock("latest")).gasLimit,
      data: data
    }
    const raw = await web3.eth.accounts.signTransaction(tx, OWNER_PRIVATE_KEY)
    console.log(raw)
    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    console.log(hash.transactionHash)
    // setTransactionData(hash.transactionHash)
    // setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    return {status: 0, message: err.message}
  } finally {
    lock.release();
  }
  
};
export const faucetByWeek = async (walletAddress) => {
  console.log(walletAddress)
  try {
    await lock.acquire()

    let data = contract.methods.requestTokenByWeek(walletAddress).encodeABI();
    console.log(data)
    const _nonce = await web3.eth.getTransactionCount("0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74", 'pending').catch(console.log)
    nonce = nonce > _nonce ? nonce : _nonce;
    console.log("nonce:", _nonce)
    let tx = {
      nonce: nonce,
      to: contractAddress.Token,
      from: "0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74",
      gasPrice:  await contract.methods.requestTokenByWeek(walletAddress).estimateGas(),
      gasLimit: (await web3.eth.getBlock("latest")).gasLimit,
      data: data
    }
    const raw = await web3.eth.accounts.signTransaction(tx, OWNER_PRIVATE_KEY)
    console.log(raw)
    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    console.log(hash.transactionHash)
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    return {status: 0, message: err.message}
  } finally {
    lock.release();
  }
};


export const faucetByMonth = async (walletAddress) => {
  console.log(walletAddress)
  try {
    await lock.acquire()

    let data = contract.methods.requestTokenByMonth(walletAddress).encodeABI();
    console.log(data)
    const _nonce = await web3.eth.getTransactionCount("0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74", 'pending').catch(console.log)
    nonce = nonce > _nonce ? nonce : _nonce;
    console.log("nonce:", _nonce)
    let tx = {
      nonce: nonce,
      to: contractAddress.Token,
      from: "0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74",
      gasPrice:  await contract.methods.requestTokenByMonth(walletAddress).estimateGas(),
      gasLimit: (await web3.eth.getBlock("latest")).gasLimit,
      data: data
    }
    const raw = await web3.eth.accounts.signTransaction(tx, OWNER_PRIVATE_KEY)
    console.log(raw)
    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    console.log(hash.transactionHash)
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    return {status: 0, message: err.message}
  } finally {
    lock.release();
  }
  };


