import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import TokenComponent from "./TokenComponent";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    contractMessage: "",
    transactionMessage: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods
      .set(5)
      .send({ from: accounts[0] })
      .on("receipt", (receipt) => {
        this.setState({
          contractMessage: `The transaction was succesful. Transaction hash: ${receipt.transactionHash}`,
        });
      })
      .on("error", (error, receipt) => {
        this.setState({
          contractMessage: `Error with transaction: ${error.message}`,
        });
      });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  transferEth = async () => {
    const { accounts, contract, web3 } = this.state;

    const addressFrom = accounts[0];
    const addressTo = "0x98864132ec962992b0aa01bD0d1360b14e0abfad";

    const transactionParameters = {
      to: addressTo,
      from: addressFrom,
      // gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
      gas: "4712388", // customizable by user during MetaMask confirmation.
      data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
      nonce: "0x00", // ignored by MetaMask
      // chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      value: web3.utils.toWei("0.5", "ether"),
    };

    await web3.eth
      .sendTransaction(transactionParameters, (err, res) => {
        console.log(err);
      })
      .on("receipt", (receipt) => {
        this.setState({
          transactionMessage: `The transaction was succesful. Transaction hash: ${receipt.transactionHash}`,
        });
      })
      .on("error", (error, receipt) => {
        this.setState({
          transactionMessage: `Error with transaction: ${error.message}`,
        });
      });
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div>Loading Web3, accounts, and contract...</div>
        </div>
      );
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 47</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <button onClick={this.transferEth}> Transfer to Account 5: </button>
        <div>{this.state.contractMessage}</div>
        <div> --------------------------- </div>
        <div>{this.state.transactionMessage}</div>
        <TokenComponent web3={this.state.web3} />
      </div>
    );
  }
}

export default App;
