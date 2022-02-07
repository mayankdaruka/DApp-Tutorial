import React, { Component, useEffect, useState } from "react";
import TutorialTokenABI from "./contracts/TutorialToken.json";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { TailSpin } from "react-loader-spinner";

function TokenComponent(props) {
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const accounts = [
    "0x7bEe8fB7273dd57b7B31d2551f5A9E3Fc56B4E01",
    "0xe900DBf9230b037A4AEc84511e41d673D7dE31fc",
    "0xcDd9Bb87e687423FfAaAFe175178B369299522EB",
  ];
  const amounts = [1, 5, 10, 50, 100, 500];
  const [accountOption, setAccountOption] = useState(accounts[0]);
  const [amountOption, setAmountOption] = useState(amounts[0]);

  useEffect(async () => {
    const web3 = props.web3;
    const tokenContractAddr = "0xA5C477376B2409d00B600EC6CB235540De88f1e9";
    const contract = new web3.eth.Contract(TutorialTokenABI, tokenContractAddr);
    setContract(contract);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log("retrieving balance");
    console.log(accounts);
    const myTokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    setTokenBalance(myTokenBalance / 10 ** 18);
  }, []);

  const sendTokens = async () => {
    const web3 = props.web3;
    console.log(accountOption);
    console.log(amountOption);
    setLoading(true);
    await contract.methods
      .transfer(accountOption, web3.utils.toWei(String(amountOption), "ether"))
      .send({ from: account })
      .on("error", (error) => {
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <div>
      <div>Account hash: {account}</div>
      <div>My token balance is: {tokenBalance}</div>
      <Dropdown
        options={accounts}
        value={accountOption}
        placeholder="Send to:"
        onChange={(option) => setAccountOption(option.value)}
      />
      <Dropdown
        options={amounts}
        value={String(amountOption)}
        placeholder="Send amount:"
        onChange={(option) => setAmountOption(option.value)}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1 }}>
          <button onClick={sendTokens}>Send Tokens</button>
        </div>
        {loading && (
          <div>
            <TailSpin />
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenComponent;
