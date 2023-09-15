require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_PRIVATE_KEY = "e11f5c9977c82fe752f84caeb9ba0c50feabd0ce90088cb26e61ee0fce5950c2";
const account2 = "40cf31902207cedc9a262552fb975403ecbd907d3407140d389922189594a553";
const account3 = "5a4b53f1f3acc7b381f5159399deab7f579f9cefafe8e31b36a4822feb3c3703";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    vbs: {
      url: "https://vibi-seed.vbchain.vn/",
      chainId: 306,
      accounts: [SEPOLIA_PRIVATE_KEY, account2, account3]
    }
  }
};

