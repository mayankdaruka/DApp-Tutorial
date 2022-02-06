import React, { Component, useEffect, useState } from "react";
import TutorialTokenABI from "./contracts/TutorialToken.json";
import DropdownButton from "react-bootstrap/DropdownButton";

function TokenComponent(props) {
  const [account, setAccount] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);
  const listAccounts = [
    "0x29230CA1205fF214aF3d3467D49aBE026E5fE2Bb",
    "0x98864132ec962992b0aa01bD0d1360b14e0abfad",
    "0x5FD6e7D52bCeb60DCB546E916320eAf46C4ADFEd",
  ];
  useEffect(async () => {
    const web3 = props.web3;
    const tokenContractAddr = "0x82B19A5e56b0C0e3a98088DE01D7bDc77C12495F";
    const contract = new web3.eth.Contract(TutorialTokenABI, tokenContractAddr);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log("retrieving balance");
    console.log(accounts);
    const myTokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    setTokenBalance(myTokenBalance);
  }, []);

  return (
    <div>
      <div>Account hash: {account}</div>
      <div>My token balance is: {tokenBalance}</div>
    </div>
  );
}

export default TokenComponent;
