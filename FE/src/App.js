import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
import * as React from 'react';


// const web3 = new Web3(Web3.givenProvider);
// const contract = new web3.eth.Contract(TokenArtifact.abi, contractAddress.Token);
const OWNER_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const owner = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  let option = 0;
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setFcContract(faucetContract(provider));
        /* set active wallet address */
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */
          setFcContract(faucetContract(provider));
          /* set active wallet address */
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };
  const donate = async () => {

  }
  const faucetByDay = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    console.log(signer)
    try {
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
      // setWithdrawError(err.message);
      setWithdrawError("Please wait next time to faucet!")

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
      // setWithdrawError(err.message);
      setWithdrawError("Please wait next time to faucet!")
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
      setWithdrawError("Please wait next time to faucet!")

    }
  };
  const handleOption = (value) => {
    option = value;
    console.log(option)
  }
  const handleFaucet = async (value) => {
    console.log("helloworld")
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
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">vibi-seed</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet VBS</h1>
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
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={() => handleFaucet(option)}
                    disabled={walletAddress ? false : true}
                  >
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Faucet Options</p>
                <div className="buttonGroup">
                  <button className="button" onClick={() => handleOption(1)}>1 ether per day</button>
                  <button className="button" onClick={() => handleOption(2)}>3 ether per week</button>
                  <button className="button" onClick={() => handleOption(3)}>10 ether per month</button>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;


