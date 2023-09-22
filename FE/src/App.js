import { useEffect, useState } from "react";
import "./App.css";
import * as React from 'react';
import contractAddress from "./contracts/contract-address.json"
import faucet from "./contracts/faucet.json";
import Web3 from 'web3';
import createLock from "./simpleLock"
// config web3 instance
let ABI = faucet.abi;
const OWNER_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";
const JsonRpcURL = "https://vibi-seed.vbchain.vn/" 
const web3 = new Web3(JsonRpcURL)
const contract = new web3.eth.Contract(ABI, contractAddress.Token)

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [option, setOption] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getBalance();
  }, []);
  
  const getBalance = async() => {
    let number = Number(await web3.eth.getBalance(contractAddress.Token))/(10**18);
    // console.log(number)
    // console.log("balance: ", balance)
    setBalance(number);
  }
  let nonce = 0;

const lock = createLock("send")

const faucetByDay = async (walletAddress) => {
  // setWithdrawError("");
  // setWithdrawSuccess("");
  console.log(walletAddress)
  try {
    await lock.acquire()

    const estimatedGasLimit = await contract.methods.requestTokensByDay(walletAddress).estimateGas().then(() => {
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
    })
    console.log("estimatedGasLimit: ", estimatedGasLimit);
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
    setTransactionData(raw.transactionHash)
    nonce = Number(nonce) + 1;
    lock.release()
    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    
    console.log(hash.transactionHash)
    // setTransactionData(hash.transactionHash)
    // setWithdrawSuccess("Operation succeeded - enjoy your tokens!");  
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    console.log(err)
    // console.log("handleRevert: ", web3.eth.handleRevert)
    return {status: 0, message: err.message}
  }
  
};
const faucetByWeek = async (walletAddress) => {
  console.log(walletAddress)
  try {
    await lock.acquire()
    const estimatedGasLimit = await contract.methods.requestTokenByWeek(walletAddress).estimateGas().then(() => {
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
    }).catch((err) => {
      setWithdrawError(err.message)
      return;
    })
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
    setTransactionData(raw.transactionHash)

    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    console.log(hash.transactionHash)
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    return {status: 0, message: err.message}
  } finally {
    lock.release();
  }
};


const faucetByMonth = async (walletAddress) => {
  console.log(walletAddress)
  try {
    await lock.acquire()
    const estimatedGasLimit = await contract.methods.requestTokenByMonth(walletAddress).estimateGas().then(() => {
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
    }).catch((err) => {
      setWithdrawError(err.message)
      return;
    })
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
    setTransactionData(raw.transactionHash)

    const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
    console.log(hash.transactionHash)
    return {status: 1, message: hash.transactionHash};
  } catch (err) {
    return {status: 0, message: err.message}
  } finally {
    lock.release();
  }
  };
  const handleOption = async(value) => {
    setOption(value);
  }
  const handleFaucet = async (value) => {
    if(value == 0) {
      setWithdrawError("Please choose one Faucet option. ");
    } else if (value == 1){
      const result = await faucetByDay(walletAddress);
      handleResult(result);
    } else if (value == 2){
      const result = await faucetByWeek(walletAddress);
      handleResult(result);
    } else if (value == 3) {
      const result = await faucetByMonth(walletAddress);
      handleResult(result);
    }
  }
  const handleInputChange = (event) => {
    setWalletAddress(event.target.value);
    console.log("walletAddress: ", walletAddress);
  };
  
  const handleResult = (result) => {
    if (result) {
      if (result.status == 1) {
        setWithdrawSuccess("Operation succeeded - enjoy your tokens!")
        setTransactionData(result.message);
      }
      else if (result.status == 0) setWithdrawError(result.message.slice(15));
    }
  }
  return (
    
    
    <div>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">VIBI Chain Faucet</h1>
            <p>Fast and reliable.</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={() => handleFaucet(option)}
                    disabled={ walletAddress ? false : true}
                  >
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Faucet Options</p>
                <div className="buttonGroup">
                  <button className="button" onClick={() => handleOption(1)}>1 Vibi per day</button>
                  <button className="button" onClick={() => handleOption(2)}>3 Vibi per week</button>
                  <button className="button" onClick={() => handleOption(3)}>10 Vibi per month</button>
                </div>
              </article>  
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>
                    {transactionData
                      ? `Transaction hash: ${transactionData}`
                      : "--"}
                  </p>
                </div>
              </article>
              {/* <article className="panel is-grey-darker"> */}
              <div className="donate">
               Donate for me to this address: <i>{contractAddress.Token}</i>
              </div>
              
            </div>
          </div>
        </div>
      </section>
      <div className="balance">
          {balance}
      </div>
    </div>
  );
}

export default App;