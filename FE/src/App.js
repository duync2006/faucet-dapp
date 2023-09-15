import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
import * as React from 'react';
import contractAddress from "./contracts/contract-address.json"

// const web3 = new Web3(Web3.givenProvider);
// const contract = new web3.eth.Contract(TokenArtifact.abi, contractAddress.Token);
const OWNER_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";

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
  
  useEffect(() => {
    connectContract();    
  });
  
  const connectContract = async () => {
    let url = "https://vibi-seed.vbchain.vn/";
    let customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    console.log((await customHttpProvider.getNetwork()).chainId)
    setFcContract(await faucetContract(customHttpProvider))
  }

  const faucetByDay = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    console.log(walletAddress)
    try {
      console.log(fcContract)
      const fcContractWithSigner = fcContract.connect(owner);
      console.log(fcContractWithSigner)
      const estimatedGasLimit = await fcContractWithSigner.estimateGas.requestTokensByDay(walletAddress);
      console.log(estimatedGasLimit)
      const resp = await fcContractWithSigner.requestTokensByDay(walletAddress, {
        gasPrice: await fcContract.estimateGas.requestTokensByDay(walletAddress),
      });
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      setTransactionData(resp.hash);
    } catch (err) {
      // console.log(err.reason);
      setWithdrawError(err.reason);
      // setWithdrawError("Please wait next day to faucet!")

    }
  };
  const faucetByWeek = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    console.log(signer)
    try {
      const fcContractWithSigner = fcContract.connect(owner);
      console.log(fcContractWithSigner)
      const estimatedGasLimit = await fcContractWithSigner.estimateGas.requestTokenByWeek(walletAddress);
      console.log(estimatedGasLimit)
      const resp = await fcContractWithSigner.requestTokenByWeek(walletAddress, {
        gasPrice: await fcContract.estimateGas.requestTokenByWeek(walletAddress),
      });
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      setTransactionData(resp.hash);
    } catch (err) {
      setWithdrawError(err.reason);
      // setWithdrawError("Please wait next week to faucet!")
    }
  };
  const faucetByMonth = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    console.log(signer)
    try {
      const fcContractWithSigner = fcContract.connect(owner);
      console.log(fcContractWithSigner)
      const estimatedGasLimit = await fcContractWithSigner.estimateGas.requestTokenByMonth(walletAddress);
      console.log(estimatedGasLimit)
      const resp = await fcContractWithSigner.requestTokenByMonth(walletAddress, {
        gasPrice: await fcContract.estimateGas.requestTokenByMonth(walletAddress),
      });
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      setTransactionData(resp.hash);
    } catch (err) {
      // setWithdrawError(err.message);
      setWithdrawError(err.reason);
    }
  };
  const handleOption = (value) => {
    setOption(value);
    // console.log(walletAddress)
  }
  const handleFaucet = async (value) => {
    console.log("value: ", value)
    console.log("option: ", option)
    if(value == 0) {
      setWithdrawError("Please choose one Faucet option. ");
    } else if (value == 1){
      await faucetByDay();
    } else if (value == 2){
      await faucetByWeek();
    } else if (value == 3) {
      await faucetByMonth();
    }
  }
  const handleInputChange = (event) => {
    setWalletAddress(event.target.value);
    console.log("walletAddress: ", walletAddress);
  };
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
                {/* <p className="panel-heading">Transaction Data</p> */}
                {/* <div className="panel-block">
                  <p>
                    {transactionData
                      ? `Transaction hash: ${transactionData}`
                      : "--"}
                  </p>
                </div> */}
              {/* </article> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;


