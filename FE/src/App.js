import { useEffect, useState } from "react";
import "./App.css";
import { ethers, utils} from "ethers";
import {NonceManager} from '@ethersproject/experimental'
import faucetContract from "./ethereum/faucet";
import * as React from 'react';
import contractAddress from "./contracts/contract-address.json"
import faucet from "./contracts/faucet.json";
import Web3 from 'web3';
import {faucetByDay, faucetByWeek, faucetByMonth} from "./sendTx";
// config web3 instance
let ABI = faucet.abi;
const OWNER_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";
const JsonRpcURL = "https://vibi-seed.vbchain.vn/" 
const web3 = new Web3(JsonRpcURL)
const contract = new web3.eth.Contract(ABI, contractAddress.Token)

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const provider = new ethers.providers.JsonRpcProvider("https://vibi-seed.vbchain.vn/");
  const owner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [option, setOption] = useState(0);
  const [balance, setBalance] = useState(0);
  const gasLimit = '0x100000'
  let iface = new ethers.utils.Interface(ABI);
  const nonceManager = new NonceManager(owner);
  // console.log("nonceManager: ", nonceManager);

  useEffect(() => {
    
    getBalance();
    // connectContract();
  }, []);
  
  // const connectContract = async () => {
  //   let url = "https://vibi-seed.vbchain.vn/";
  //   // let customHttpProvider = new ethers.providers.JsonRpcProvider(url);
  //   await provider.getNetwork().chainId;
  //   setFcContract(await faucetContract(provider))
  // }
  const getBalance = async() => {
    let number = Number(await web3.eth.getBalance(contractAddress.Token))/(10**18);
    // console.log(number)
    // console.log("balance: ", balance)
    setBalance(number);
  }

  // const faucetByDay = async () => {
  //   setWithdrawError("");
  //   setWithdrawSuccess("");
  //   console.log(walletAddress)
  //   try {
  //     web3.eth.handleRevert = true;
  //     const estimatedGasLimit = await contract.methods.requestTokensByDay(walletAddress).estimateGas();
  //     // console.log("estimategas: ", contract.methods.requestTokensByDay(walletAddress).estimateGas())
  //     console.log(estimatedGasLimit)
  //     let data = contract.methods.requestTokensByDay(walletAddress).encodeABI();
  //     console.log(data)

  //     let tx = {
  //       nonce: await web3.eth.getTransactionCount("0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74", 'pending'),
  //       to: contractAddress.Token,
  //       from: "0x76E046c0811edDA17E57dB5D2C088DB0F30DcC74",
  //       gasPrice:  await contract.methods.requestTokensByDay(walletAddress).estimateGas(),
  //       gasLimit: (await web3.eth.getBlock("latest")).gasLimit,
  //       data: data
  //     }
  //     const raw = await web3.eth.accounts.signTransaction(tx, OWNER_PRIVATE_KEY)
  //     console.log(raw)
  //     const hash = await web3.eth.sendSignedTransaction(raw.rawTransaction)
  //     console.log(hash)
  //     setTransactionData(hash.transactionHash)
  //     setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
  //   } catch (err) {
  //     if(err.message == "Returned error: replacement transaction underpriced") {
  //       faucetByDay();
  //     } else {
  //       setWithdrawError(err.message);
  //     }
  //   }
    
  // };
  // const faucetByWeek = async () => {
  //   setWithdrawError("");
  //   setWithdrawSuccess("");
  //   console.log(signer)
  //   try {
  //     const fcContractWithSigner = fcContract.connect(owner);
  //     console.log(fcContractWithSigner)
  //     const estimatedGasLimit = await fcContractWithSigner.estimateGas.requestTokenByWeek(walletAddress);
  //     console.log(estimatedGasLimit)
  //     const resp = await fcContractWithSigner.requestTokenByWeek(walletAddress, {
  //       gasPrice: await fcContract.estimateGas.requestTokenByWeek(walletAddress),
  //     });
  //     setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
  //     setTransactionData(resp.hash);
  //   } catch (err) {
  //     setWithdrawError(err.reason);
  //     // setWithdrawError("Please wait next week to faucet!")
  //   }
  // };
  // const faucetByMonth = async () => {
  //   setWithdrawError("");
  //   setWithdrawSuccess("");
  //   console.log(signer)
  //   try {
      
  //     const fcContractWithSigner = fcContract.connect(owner);
  //     console.log(fcContractWithSigner)
  //     const estimatedGasLimit = await fcContractWithSigner.estimateGas.requestTokenByMonth(walletAddress);
  //     console.log(estimatedGasLimit)
  //     const resp = await fcContractWithSigner.requestTokenByMonth(walletAddress, {
  //       gasPrice: await fcContract.estimateGas.requestTokenByMonth(walletAddress),
  //     });
  //     setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
  //     setTransactionData(resp.hash);
  //   } catch (err) {
  //     // setWithdrawError(err.message);
  //     setWithdrawError(err.reason);
  //   }
  // };
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
      else if (result.status == 0) setWithdrawError(result.message);
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